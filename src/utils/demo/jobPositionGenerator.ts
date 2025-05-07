
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate job positions for the demo company
 * @param companyId The company ID to associate positions with
 * @param departmentIds Object with department names as keys and their IDs as values
 * @returns Object with position titles as keys and their IDs as values
 */
export const generateJobPositions = async (
  companyId: string, 
  departmentIds: Record<string, string>
): Promise<Record<string, string>> => {
  const positions = [
    { title: 'Diretor Executivo', department: 'Administração', description: 'Responsável pela direção global da empresa' },
    { title: 'Gerente de RH', department: 'Recursos Humanos', description: 'Gestão da equipe de recursos humanos' },
    { title: 'Analista de RH', department: 'Recursos Humanos', description: 'Suporte em processos de RH' },
    { title: 'Desenvolvedor Senior', department: 'Tecnologia', description: 'Desenvolvimento de software avançado' },
    { title: 'Desenvolvedor Pleno', department: 'Tecnologia', description: 'Desenvolvimento de software e aplicações' },
    { title: 'Gerente de Produção', department: 'Produção', description: 'Gestão dos processos produtivos' },
    { title: 'Analista de Qualidade', department: 'Produção', description: 'Análise e controle de qualidade' },
    { title: 'Cientista Chefe', department: 'Pesquisa e Desenvolvimento', description: 'Liderança em projetos de pesquisa' },
    { title: 'Pesquisador', department: 'Pesquisa e Desenvolvimento', description: 'Condução de pesquisas e experimentos' },
    { title: 'Gerente de Marketing', department: 'Marketing', description: 'Estratégias e campanhas de marketing' },
    { title: 'Especialista em Mídias Sociais', department: 'Marketing', description: 'Gestão de presença digital' },
    { title: 'Gerente de Vendas', department: 'Vendas', description: 'Gestão da equipe de vendas' },
    { title: 'Representante Comercial', department: 'Vendas', description: 'Relacionamento com clientes e vendas' }
  ];
  
  const positionIds: Record<string, string> = {};
  
  for (const pos of positions) {
    try {
      const { data: posResult, error: posError } = await supabase
        .from('job_positions')
        .insert({
          title: pos.title,
          department: pos.department,
          description: pos.description,
          company_id: companyId
        })
        .select('id')
        .single();
        
      if (posError) {
        console.error(`Error creating position ${pos.title}:`, posError);
        continue;
      }
      
      positionIds[pos.title] = posResult.id;
    } catch (error) {
      console.error(`Error creating position ${pos.title}:`, error);
    }
  }
  
  return positionIds;
};
