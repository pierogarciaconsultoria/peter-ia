
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

    const { identity } = await req.json();
    
    if (!identity) {
      throw new Error("Identidade estratégica não fornecida");
    }

    // Preparar o prompt para o OpenAI
    const prompt = `
Você é um consultor especializado em gestão estratégica e indicadores de desempenho.
Com base na identidade estratégica fornecida, sugira 3 a 5 indicadores de desempenho (KPIs) que 
ajudariam a organização a monitorar o progresso em direção à sua missão e visão, alinhados com seus valores.

Identidade Estratégica:
Missão: ${identity.mission}
Visão: ${identity.vision}
Valores: ${identity.values.join(', ')}

Para cada indicador sugerido, forneça:
1. Nome do indicador
2. Descrição (o que este indicador mede e por que é importante)
3. Meta sugerida (um valor numérico com sua unidade - %, R$, unidades, etc.)
4. Tipo de meta (maior é melhor, menor é melhor, ou valor específico)
5. Tipo de cálculo (soma ou média)

Formate sua resposta em JSON com o seguinte formato:
{
  "indicators": [
    {
      "name": "Nome do Indicador 1",
      "description": "Descrição do que o indicador mede",
      "process": "Processo relacionado",
      "goal_value": 95,
      "unit": "%",
      "goal_type": "higher_better",
      "calculation_type": "average"
    },
    ...
  ]
}

Para o tipo de meta (goal_type), use:
- "higher_better" quando valores maiores são melhores (ex: satisfação de clientes)
- "lower_better" quando valores menores são melhores (ex: tempo de resposta)
- "target" quando há um valor específico a ser atingido

Para o tipo de cálculo (calculation_type), use:
- "sum" quando o valor é cumulativo (ex: receita total)
- "average" quando o valor é uma média (ex: tempo médio de resposta)
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um consultor especializado em indicadores de desempenho e gestão estratégica.' },
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
    console.error('Error in generate-strategic-indicators function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
