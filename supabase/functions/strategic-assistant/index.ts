
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY environment variable not set");
    }

    const { message, context } = await req.json();
    
    if (!message) {
      throw new Error("Mensagem não fornecida");
    }

    // Preparar o prompt para o OpenAI
    const systemPrompt = `
Você é um assistente especializado em planejamento estratégico para organizações.
Seu objetivo é ajudar os usuários a definir e estruturar sua estratégia organizacional.
Suas respostas devem ser concisas, diretas e orientadas à ação.

Você tem conhecimento específico sobre:
- Identidade Estratégica (Missão, Visão e Valores)
- Análise SWOT (Forças, Fraquezas, Oportunidades e Ameaças)
- Balanced Scorecard (Perspectivas Financeira, Clientes, Processos Internos, Aprendizado e Crescimento)
- Business Model Canvas (9 componentes do modelo de negócios)

Se solicitado pelo usuário, ofereça dicas práticas para melhorar cada um desses componentes.
Mantenha suas respostas relevantes ao contexto do planejamento estratégico.
Responda sempre em português.
`;

    console.log("Calling OpenAI API...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context && context.length > 0 ? context : []),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`Erro ao chamar a API do OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      model: data.model 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in strategic-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
