
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
    const { resumeText, jobDescription } = await req.json();
    
    if (!resumeText || !jobDescription) {
      throw new Error('Resumo e descrição da vaga são obrigatórios');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('API key não configurada');
    }

    const prompt = `
    Atue como um recrutador experiente analisando a compatibilidade entre um currículo e uma vaga.
    
    Descrição da vaga:
    ${jobDescription}
    
    Currículo do candidato:
    ${resumeText}
    
    Avalie a compatibilidade do candidato com a vaga considerando:
    1. Habilidades técnicas necessárias
    2. Experiência relevante
    3. Formação acadêmica
    4. Compatibilidade comportamental baseada no texto
    
    Forneça uma pontuação de 0 a 100 para o nível de compatibilidade geral.
    Forneça uma recomendação clara: "Recomendado para próxima fase", "Possível candidato" ou "Não recomendado".
    Liste os pontos fortes e fracos do candidato em relação à vaga.
    
    Retorne a análise no seguinte formato JSON:
    {
      "compatibility_score": [número de 0 a 100],
      "recommendation": "[recomendação]",
      "strengths": ["força 1", "força 2", ...],
      "weaknesses": ["fraqueza 1", "fraqueza 2", ...],
      "analysis": "[análise detalhada]"
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um assistente de recrutamento que avalia currículos.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Resposta inválida da API');
    }
    
    const analysisResult = JSON.parse(data.choices[0].message.content);
    
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao analisar currículo:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
