
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, value } = await req.json();
    
    if (!name || !value) {
      throw new Error('Os parâmetros "name" e "value" são obrigatórios');
    }

    // Note: This Edge Function only demonstrates the API.
    // In production, you would use Supabase's secret management API
    // or implement your own secure storage solution.
    
    // For now, we'll just confirm we got the request
    console.log(`Received request to set secret: ${name}`);
    
    // In a real implementation, you would store the secret in a secure location
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error setting secret:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
