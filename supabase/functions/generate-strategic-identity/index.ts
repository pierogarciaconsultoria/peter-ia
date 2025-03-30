
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

    const { responses } = await req.json();
    
    if (!responses) {
      throw new Error("Respostas não fornecidas");
    }

    // Preparar o prompt para o OpenAI
    const prompt = `
Você é um consultor especializado em planejamento estratégico empresarial. 
Com base nas respostas fornecidas pelo cliente para as perguntas sobre identidade estratégica, 
elabore sugestões para a Missão, Visão e Valores da empresa.

Respostas sobre a Missão:
${responses.mission.map((response, index) => `Pergunta ${index + 1}: ${response}`).join('\n')}

Respostas sobre a Visão:
${responses.vision.map((response, index) => `Pergunta ${index + 1}: ${response}`).join('\n')}

Respostas sobre os Valores:
${responses.values.map((response, index) => `Pergunta ${index + 1}: ${response}`).join('\n')}

Por favor, elabore:
1. Uma declaração de Missão concisa (max. 2 parágrafos)
2. Uma declaração de Visão inspiradora (max. 2 parágrafos)
3. Uma lista de 3 a 7 Valores fundamentais (com uma breve descrição para cada)

Formate sua resposta em JSON com o seguinte formato:
{
  "mission": "Texto da missão sugerida",
  "vision": "Texto da visão sugerida",
  "values": ["Valor 1", "Valor 2", "Valor 3", ...]
}
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
          { role: 'system', content: 'Você é um consultor especializado em planejamento estratégico empresarial.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`Erro ao chamar a API do OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-strategic-identity function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
