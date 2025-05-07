
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate departments for the demo company
 * @param companyId The company ID to associate departments with
 * @returns Object with department names as keys and their IDs as values
 */
export const generateDepartments = async (companyId: string): Promise<Record<string, string>> => {
  const departments = [
    { name: 'Administração', description: 'Gestão administrativa e financeira' },
    { name: 'Recursos Humanos', description: 'Gestão de pessoas e desenvolvimento' },
    { name: 'Tecnologia', description: 'Desenvolvimento de tecnologias inovadoras' },
    { name: 'Produção', description: 'Fabricação de dispositivos e sistemas' },
    { name: 'Pesquisa e Desenvolvimento', description: 'Pesquisa avançada e desenvolvimento' },
    { name: 'Marketing', description: 'Comunicação e estratégias de mercado' },
    { name: 'Vendas', description: 'Comercialização e relacionamento com clientes' }
  ];
  
  const departmentIds: Record<string, string> = {};
  
  for (const dept of departments) {
    try {
      const { data: deptResult, error: deptError } = await supabase
        .from('departments')
        .insert({
          name: dept.name,
          description: dept.description,
          company_id: companyId
        })
        .select('id')
        .single();
        
      if (deptError) {
        console.error(`Error creating department ${dept.name}:`, deptError);
        continue;
      }
      
      departmentIds[dept.name] = deptResult.id;
    } catch (error) {
      console.error(`Error creating department ${dept.name}:`, error);
    }
  }
  
  return departmentIds;
};
