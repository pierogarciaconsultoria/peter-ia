
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      return new Response(JSON.stringify({ error: "Webhook signature missing" }), { status: 400 });
    }
    
    // Get the webhook secret from env variables
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), { status: 500 });
    }
    
    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), { status: 400 });
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract company_id and plan_id from metadata
        const companyId = session.metadata?.company_id;
        const planId = session.subscription_data?.metadata?.plan_id;
        
        if (companyId && planId) {
          // Update the company's plan
          await supabaseClient
            .from('companies')
            .update({ 
              plan: planId,
              updated_at: new Date().toISOString()
            })
            .eq('id', companyId);
        }
        
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const planId = subscription.metadata?.plan_id;
        const companyId = subscription.metadata?.company_id;
        
        if (companyId && planId) {
          // Update the company's plan
          await supabaseClient
            .from('companies')
            .update({ 
              plan: planId,
              updated_at: new Date().toISOString()
            })
            .eq('id', companyId);
        }
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const companyId = subscription.metadata?.company_id;
        
        if (companyId) {
          // Downgrade to free plan when subscription is canceled
          await supabaseClient
            .from('companies')
            .update({ 
              plan: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('id', companyId);
        }
        
        break;
      }
      
      default:
        // Unhandled event type
    }
    
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
