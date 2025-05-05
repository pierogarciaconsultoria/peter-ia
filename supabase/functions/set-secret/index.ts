
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
    const { name, value } = await req.json();
    
    if (!name || !value) {
      throw new Error('Os campos "name" e "value" são obrigatórios');
    }

    // Verifique se o usuário tem permissão de admin - no ambiente Supabase
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autenticação não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Verificar o token e obter as informações do usuário
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseServiceKey
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Token inválido ou expirado');
    }
    
    const userData = await userResponse.json();
    
    // Verificar se o usuário é um super admin
    const { data: profileData, error: profileError } = await fetch(
      `${supabaseUrl}/rest/v1/user_profiles?id=eq.${userData.id}&select=is_super_admin`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        }
      }
    ).then(res => res.json());
    
    if (profileError) {
      throw new Error('Erro ao verificar perfil do usuário');
    }
    
    if (!profileData || profileData.length === 0 || !profileData[0].is_super_admin) {
      throw new Error('Apenas super administradores podem configurar segredos');
    }

    // Obter o client do Supabase Admin para definir os segredos
    const adminApiUrl = `${supabaseUrl}/rest/v1/secrets`;
    
    // Definir o segredo usando a API Admin
    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        value: value
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao definir o segredo: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true, message: 'Segredo definido com sucesso' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao definir segredo:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
