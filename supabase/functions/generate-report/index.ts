
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

    const { analysis } = await req.json();
    
    if (!analysis) {
      throw new Error("Análise não fornecida");
    }

    // Preparar o prompt para o OpenAI
    const prompt = `
Você é um especialista em análise crítica de sistemas de gestão da qualidade. 
Elabore um relatório detalhado e profissional com base nas informações fornecidas abaixo.
Use linguagem formal e técnica, mas clara e objetiva.

Informações da análise crítica:
- Assunto: ${analysis.subject}
- Status: ${analysis.status}
- Participantes: ${analysis.participants.join(", ")}
- Documentos de referência: ${analysis.documents.join(", ")}

Requisitos para entrada da análise crítica:
1. Situação de ações anteriores: ${analysis.previousActionsStatus}
2. Mudanças externas e internas: ${analysis.externalInternalChanges}
3. Informações de desempenho: ${analysis.performanceInfo}
4. Suficiência de recursos: ${analysis.resourceSufficiency}
5. Eficácia de ações para riscos: ${analysis.riskActionsEffectiveness}
6. Oportunidades de melhoria identificadas: ${analysis.improvementOpportunities}

Resultados da análise crítica:
1. Oportunidades para melhoria: ${analysis.improvementResults}
2. Necessidades de mudança no SGQ: ${analysis.systemChangeNeeds}
3. Necessidade de recursos: ${analysis.resourceNeeds}
4. Resultados gerais: ${analysis.results}

Por favor, elabore um relatório detalhado que:
1. Faça uma introdução sobre o propósito da análise crítica
2. Resuma as entradas da análise crítica, destacando os pontos importantes
3. Analise os resultados obtidos
4. Conclua com recomendações concretas e próximos passos
5. Use linguagem formal e profissional
6. Organize o texto em seções bem definidas com títulos

Use formato Markdown para o relatório.
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
          { role: 'system', content: 'Você é um assistente especializado em sistemas de gestão da qualidade, análise crítica e relatórios profissionais.' },
          { role: 'user', content: prompt }
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
    const generatedReport = data.choices[0].message.content;

    return new Response(JSON.stringify({ report: generatedReport }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-report function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
