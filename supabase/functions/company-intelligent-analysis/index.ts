
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { companyData, analysisType = 'complete' } = await req.json();
    
    console.log('Analyzing company:', companyData);

    const analysisPrompt = `
Você é um consultor especialista em gestão empresarial. Analise as informações da empresa abaixo e forneça sugestões detalhadas:

**INFORMAÇÕES DA EMPRESA:**
- Nome: ${companyData.name}
- Setor: ${companyData.company_sector || 'Não informado'}
- Porte: ${companyData.company_size || 'Não informado'}
- Descrição da Operação: ${companyData.company_description || 'Não informado'}
- Problemas Operacionais: ${companyData.operational_problems || 'Não informado'}
- Objetivos de Negócio: ${companyData.business_objectives || 'Não informado'}

**FORNEÇA ANÁLISE E SUGESTÕES EM FORMATO JSON com as seguintes seções:**

1. **strategic_planning**: Missão, Visão, Valores e objetivos estratégicos personalizados
2. **iso9001_priorities**: Top 10 requisitos ISO 9001 mais relevantes com cronograma
3. **kpis**: 8 indicadores de performance específicos para o setor/porte
4. **action_plan**: Plano de ação de 90 dias com prioridades
5. **risk_analysis**: Principais riscos identificados
6. **improvement_opportunities**: Oportunidades de melhoria imediatas

Formate a resposta como JSON válido, sendo específico e prático para o contexto da empresa.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um consultor empresarial especializado. Responda sempre em português brasileiro e formate como JSON válido.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let aiSuggestions;
    
    try {
      aiSuggestions = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback: create structured response
      aiSuggestions = {
        strategic_planning: { error: 'Erro ao processar resposta da IA' },
        iso9001_priorities: [],
        kpis: [],
        action_plan: [],
        risk_analysis: [],
        improvement_opportunities: []
      };
    }

    // Salvar análise no banco
    const { data: analysisRecord, error: dbError } = await supabaseClient
      .from('company_analysis')
      .insert({
        company_id: companyData.id,
        analysis_type: analysisType,
        input_data: companyData,
        ai_suggestions: aiSuggestions,
        status: 'generated'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Erro ao salvar análise no banco de dados');
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: aiSuggestions,
      analysisId: analysisRecord.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in company-intelligent-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
