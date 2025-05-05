
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModuleContext {
  id: string;
  name: string;
  label: string;
  description: string;
  enabled: boolean;
  capabilities: string;
  limitations: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, moduleContext } = await req.json();
    
    if (!prompt || !moduleContext) {
      throw new Error('Os parâmetros "prompt" e "moduleContext" são obrigatórios');
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('A chave da API OpenAI não está configurada');
    }

    // Preparar o sistema de prompt com o contexto do módulo
    const system = `
Você é um assistente virtual para o módulo "${moduleContext.label}" de um sistema de gestão empresarial.

Sobre este módulo:
${moduleContext.description || 'Este é um módulo do sistema.'}

Capacidades:
${moduleContext.capabilities || 'Responder perguntas sobre o módulo.'}

Limitações:
${moduleContext.limitations || 'Não posso modificar dados do sistema nem acessar informações de outros módulos.'}

Responda de forma clara, profissional e objetiva às perguntas dos usuários sobre este módulo específico.
    `;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(`Erro da API OpenAI: ${JSON.stringify(error)}`);
    }

    const data = await openaiResponse.json();
    const response = data.choices[0].message.content;

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no assistente do módulo:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "Desculpe, não foi possível processar sua pergunta. Por favor, verifique se a chave da API está configurada corretamente."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
