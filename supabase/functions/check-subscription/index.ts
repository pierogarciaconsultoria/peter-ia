
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.id) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get company id for the user
    const { data: profileData, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Error retrieving user profile" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const companyId = profileData.company_id;
    
    if (!companyId) {
      return new Response(
        JSON.stringify({ error: "User has no associated company" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check for company subscription details
    const { data: company, error: companyError } = await supabaseClient
      .from('companies')
      .select('id, name, plan, active_modules')
      .eq('id', companyId)
      .single();
      
    if (companyError) {
      return new Response(
        JSON.stringify({ error: "Error retrieving company data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Get the Stripe customer ID for this company
    const { data: customerData, error: customerError } = await supabaseClient
      .from('stripe_customers')
      .select('customer_id')
      .eq('company_id', companyId)
      .limit(1);
      
    if (customerError) {
      return new Response(
        JSON.stringify({ error: "Error retrieving Stripe customer information" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // For free plan or no Stripe customer, return the current plan
    if (company.plan === 'free' || !customerData || customerData.length === 0) {
      return new Response(
        JSON.stringify({
          subscription: {
            status: "active",
            plan: company.plan || "free",
            current_period_end: null,
          },
          company: {
            id: company.id,
            name: company.name,
            active_modules: company.active_modules
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerData[0].customer_id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No active subscription in Stripe
      return new Response(
        JSON.stringify({
          subscription: {
            status: "inactive",
            plan: company.plan,
            current_period_end: null,
          },
          company: {
            id: company.id,
            name: company.name,
            active_modules: company.active_modules
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subscription = subscriptions.data[0];
    const planId = subscription.metadata.plan_id || company.plan;
    
    return new Response(
      JSON.stringify({
        subscription: {
          status: subscription.status,
          plan: planId,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        },
        company: {
          id: company.id,
          name: company.name,
          active_modules: company.active_modules
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to check subscription" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
