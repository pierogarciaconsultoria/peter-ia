
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
    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      return new Response(
        JSON.stringify({ error: "User not authenticated or email not available" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get request body
    const { planId } = await req.json();
    
    // Get company info for the user
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('company_id, first_name, last_name')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Error retrieving user profile" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Get company data
    const { data: companyData, error: companyError } = await supabaseClient
      .from('companies')
      .select('id, name, slug, plan')
      .eq('id', userProfile.company_id)
      .single();
      
    if (companyError) {
      return new Response(
        JSON.stringify({ error: "Error retrieving company data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get or create Stripe customer
    let customerId;
    const { data: customers, error: customerError } = await supabaseClient
      .from('stripe_customers')
      .select('customer_id')
      .eq('company_id', companyData.id)
      .limit(1);
      
    if (customerError) {
      return new Response(
        JSON.stringify({ error: "Error retrieving Stripe customer information" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    if (customers && customers.length > 0) {
      customerId = customers[0].customer_id;
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: companyData.name,
        metadata: {
          company_id: companyData.id,
          user_id: user.id
        }
      });
      
      customerId = customer.id;
      
      // Save the customer ID in our database
      await supabaseClient.from('stripe_customers').insert({
        company_id: companyData.id,
        customer_id: customerId,
        created_at: new Date().toISOString()
      });
    }

    // Get prices from Stripe based on planId
    let priceId;
    switch (planId) {
      case 'basic':
        priceId = Deno.env.get("STRIPE_BASIC_PRICE_ID");
        break;
      case 'pro':
        priceId = Deno.env.get("STRIPE_PRO_PRICE_ID");
        break;
      case 'enterprise':
        priceId = Deno.env.get("STRIPE_ENTERPRISE_PRICE_ID");
        break;
      default:
        // Free plan - redirect to success without creating a checkout session
        return new Response(
          JSON.stringify({ 
            url: `${req.headers.get("origin")}/subscription/success?plan=free` 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Invalid plan selected or plan price not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      subscription_data: {
        metadata: {
          company_id: companyData.id,
          plan_id: planId
        }
      },
      metadata: {
        company_id: companyData.id,
        user_id: user.id
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create checkout session" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
