
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { secret_name } = await req.json();
    
    if (!secret_name) {
      throw new Error('O parâmetro "secret_name" é obrigatório');
    }

    // Verificar se o segredo existe no ambiente
    const secretExists = Deno.env.get(secret_name) !== undefined;

    return new Response(JSON.stringify({ exists: secretExists }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao verificar segredo:', error);
    
    return new Response(JSON.stringify({ error: error.message, exists: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
