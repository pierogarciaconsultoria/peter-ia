import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AuthError, corsHeaders, jsonResponse, requireUser } from "../_shared/auth.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

/**
 * Estrutura JSON exigida da IA. Cada bloco alimenta um módulo do sistema:
 * strategic_planning -> Identidade, SWOT, BSC e Canvas (Planejamento Estratégico)
 * kpis               -> Indicadores de Desempenho
 * action_plan        -> Plano de Ação (5W2H)
 * risk_analysis      -> Gestão de Riscos
 * iso9001_priorities / improvement_opportunities -> Contexto e melhoria
 */
const RESPONSE_SCHEMA = `
{
  "strategic_planning": {
    "mission": "texto",
    "vision": "texto",
    "values": ["valor 1", "valor 2", "valor 3", "valor 4", "valor 5"],
    "ultimate_goal": "objetivo final da empresa em uma frase mensurável, com horizonte de 3 a 5 anos",
    "pillars": [{ "name": "pilar estratégico", "description": "texto", "bsc_perspective": "financial | customer | internal_process | learning_growth" }],
    "swot": {
      "strengths":     [{ "description": "texto", "impact_level": 1-5 }],
      "weaknesses":    [{ "description": "texto", "impact_level": 1-5 }],
      "opportunities": [{ "description": "texto", "impact_level": 1-5 }],
      "threats":       [{ "description": "texto", "impact_level": 1-5 }]
    },
    "bsc_objectives": [
      {
        "perspective": "financial | customer | internal_process | learning_growth",
        "title": "objetivo estratégico",
        "description": "como esse objetivo se conecta à missão/visão",
        "measure": { "name": "nome do KPI", "start_value": 80, "target": 95, "unit": "%", "goal_type": "higher_better | lower_better | target" }
      }
    ],
    "business_model_canvas": {
      "key_partners": "texto", "key_activities": "texto", "key_resources": "texto",
      "value_propositions": "texto", "customer_relationships": "texto", "channels": "texto",
      "customer_segments": "texto", "cost_structure": "texto", "revenue_streams": "texto"
    }
  },
  "iso9001_priorities": [{ "requirement": "4.1", "title": "texto", "why": "texto", "timeline": "texto" }],
  "kpis": [{ "name": "texto", "description": "texto", "process": "texto", "target": 95, "unit": "%", "goal_type": "higher_better | lower_better | target", "calculation_type": "sum | average" }],
  "action_plan": [
    {
      "title": "texto curto",
      "what": "o que será feito",
      "why": "por que (ligar a um objetivo BSC, item SWOT ou prioridade ISO)",
      "how": "como será feito",
      "responsible": "cargo/área sugerida",
      "priority": "low | medium | high | critical",
      "due_in_days": 30,
      "process_area": "management | quality | manufacturing | hr | sales | supply_chain | other"
    }
  ],
  "risk_analysis": [{ "title": "texto", "description": "texto", "category": "texto", "process": "texto", "probability": 1-5, "impact": 1-5, "mitigation": "texto", "type": "internal | external" }],
  "improvement_opportunities": [{ "title": "texto", "description": "texto" }]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    // Exige usuário logado; a chave anon pública não basta
    const { supabase, profile } = await requireUser(req);

    const { companyData, analysisType = 'complete' } = await req.json();
    if (!companyData?.id) {
      return jsonResponse({ success: false, error: 'companyData.id é obrigatório' }, 400);
    }

    // Só analisa a própria empresa (super admin pode analisar qualquer uma)
    if (!profile?.is_super_admin && profile?.company_id !== companyData.id) {
      return jsonResponse({ success: false, error: 'Sem permissão para analisar esta empresa' }, 403);
    }

    const website = companyData.company_website || companyData?.settings?.ai_context?.company_website || 'Não informado';
    const instagram = companyData.company_instagram || companyData?.settings?.ai_context?.company_instagram || 'Não informado';

    const analysisPrompt = `
Você é um consultor sênior em gestão empresarial, planejamento estratégico e ISO 9001:2015.
Analise a empresa abaixo e produza um PLANEJAMENTO ESTRATÉGICO COMPLETO e um plano de implantação ISO 9001.

**INFORMAÇÕES DA EMPRESA:**
- Nome: ${companyData.name}
- Setor: ${companyData.company_sector || 'Não informado'}
- Porte: ${companyData.company_size || 'Não informado'}
- Descrição da Operação: ${companyData.company_description || 'Não informado'}
- Problemas Operacionais: ${companyData.operational_problems || 'Não informado'}
- Objetivos de Negócio: ${companyData.business_objectives || 'Não informado'}
- Site: ${website}
- Instagram: ${instagram}

**REGRAS:**
1. Missão e visão concisas (até 2 parágrafos cada). De 4 a 6 valores, cada um com 1 a 3 palavras. Um objetivo final (ultimate_goal) e de 3 a 5 pilares estratégicos, cada pilar associado à perspectiva BSC mais próxima.
2. SWOT com 3 a 5 itens por quadrante, específicos para o setor/porte e para os problemas relatados. impact_level de 1 (baixo) a 5 (alto).
3. BSC com 2 ou 3 objetivos por perspectiva (financial, customer, internal_process, learning_growth), cada um com UM resultado-chave mensurável (nome, valor inicial estimado, meta numérica, unidade). O objetivo em si não tem métrica.
4. Business Model Canvas com os 9 blocos preenchidos em texto corrido (use ";" para separar itens).
5. 8 KPIs operacionais em "kpis" (podem coincidir com os do BSC).
6. Plano de ação de 90 dias com 8 a 12 ações 5W2H, cada uma ligada a um objetivo BSC, item SWOT ou prioridade ISO no campo "why". due_in_days entre 7 e 90.
7. Top 10 requisitos ISO 9001 em "iso9001_priorities" e 5 a 8 riscos em "risk_analysis".
8. Responda SOMENTE com JSON válido, em português brasileiro, exatamente nesta estrutura:
${RESPONSE_SCHEMA}
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
          { role: 'system', content: 'Você é um consultor empresarial especializado. Responda sempre em português brasileiro e somente com JSON válido.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.5,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('OpenAI API error:', response.status, detail);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let aiSuggestions;
    try {
      aiSuggestions = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('A IA retornou um conteúdo que não pôde ser interpretado. Tente novamente.');
    }

    // Histórico da análise (RLS: só a própria empresa)
    const { data: analysisRecord, error: dbError } = await supabase
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
      // Não bloqueia o usuário: a análise já foi gerada
      console.error('Database error saving company_analysis:', dbError);
    }

    return jsonResponse({
      success: true,
      analysis: aiSuggestions,
      analysisId: analysisRecord?.id ?? null,
      saved: !dbError,
    });

  } catch (error) {
    console.error('Error in company-intelligent-analysis:', error);
    const status = error instanceof AuthError ? error.status : 500;
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ error: message, success: false }, status);
  }
});
