
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

    // Get the request body
    const { return_url } = await req.json();
    
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

    // Get the Stripe customer ID for this company
    const { data: customerData, error: customerError } = await supabaseClient
      .from('stripe_customers')
      .select('customer_id')
      .eq('company_id', companyId)
      .limit(1);
      
    if (customerError || !customerData || customerData.length === 0) {
      return new Response(
        JSON.stringify({ error: "No billing information found for this company" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    const customerId = customerData[0].customer_id;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: return_url || `${req.headers.get("origin")}/settings/billing`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create billing portal session" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
