
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Checks if Stark Corporation already exists
 * @returns boolean indicating if Stark Corporation exists
 */
export const checkStarkCorpExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('name', 'Stark Corporation')
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
      console.error("Error checking for Stark Corporation:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkStarkCorpExists:", error);
    return false;
  }
};

/**
 * Generates demo data for Stark Corporation
 * @returns boolean indicating if operation was successful
 */
export const generateDemoCompany = async (): Promise<boolean> => {
  try {
    // Check if company already exists
    const exists = await checkStarkCorpExists();
    if (exists) {
      console.log("Stark Corporation already exists");
      return true;
    }
    
    // Create company
    let companyId = '';
    const { data: companyResult, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Stark Corporation',
        slug: 'stark-corporation',
        email: 'contato@starkcorp.com',
        phone: '+1 (212) 970-4760',
        address: '200 Park Avenue, Manhattan, New York City, NY 10166',
        cnpj: '45.123.987/0001-01',
        responsible: 'Tony Stark',
        active: true,
        active_modules: ['hr', 'quality', 'strategic'],
        plan: 'enterprise'
      })
      .select('id')
      .single();
      
    if (companyError) {
      console.error("Error creating company:", companyError);
      return false;
    }
    
    companyId = companyResult.id;
    
    // Create departments
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
    }
    
    // Create job positions
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
    }
    
    // Create employees
    const employees = [
      {
        name: 'Tony Stark',
        email: 'tony.stark@starkcorp.com',
        department: 'Administração',
        position: 'Diretor Executivo',
        status: 'active' as const,
        hire_date: '2008-05-02',
        phone: '(11) 99876-5432'
      },
      {
        name: 'Pepper Potts',
        email: 'pepper.potts@starkcorp.com',
        department: 'Recursos Humanos',
        position: 'Gerente de RH',
        status: 'active' as const,
        hire_date: '2010-04-15',
        phone: '(11) 99765-4321'
      },
      {
        name: 'Bruce Banner',
        email: 'bruce.banner@starkcorp.com',
        department: 'Pesquisa e Desenvolvimento',
        position: 'Cientista Chefe',
        status: 'active' as const,
        hire_date: '2012-09-20',
        phone: '(11) 99654-3210'
      },
      {
        name: 'Natasha Romanoff',
        email: 'natasha.romanoff@starkcorp.com',
        department: 'Produção',
        position: 'Gerente de Produção',
        status: 'active' as const,
        hire_date: '2015-03-10',
        phone: '(11) 99543-2109'
      },
      {
        name: 'Clint Barton',
        email: 'clint.barton@starkcorp.com',
        department: 'Produção',
        position: 'Analista de Qualidade',
        status: 'active' as const,
        hire_date: '2014-11-05',
        phone: '(11) 99432-1098'
      },
      {
        name: 'Steve Rogers',
        email: 'steve.rogers@starkcorp.com',
        department: 'Vendas',
        position: 'Gerente de Vendas',
        status: 'active' as const,
        hire_date: '2011-07-04',
        phone: '(11) 99321-0987'
      },
      {
        name: 'Thor Odinson',
        email: 'thor.odinson@starkcorp.com',
        department: 'Marketing',
        position: 'Gerente de Marketing',
        status: 'active' as const,
        hire_date: '2013-01-15',
        phone: '(11) 99210-9876'
      },
      {
        name: 'Peter Parker',
        email: 'peter.parker@starkcorp.com',
        department: 'Tecnologia',
        position: 'Desenvolvedor Pleno',
        status: 'active' as const,
        hire_date: '2018-06-01',
        phone: '(11) 99109-8765'
      },
      {
        name: 'Wanda Maximoff',
        email: 'wanda.maximoff@starkcorp.com',
        department: 'Pesquisa e Desenvolvimento',
        position: 'Pesquisador',
        status: 'on_leave' as const,
        hire_date: '2019-03-15',
        phone: '(11) 99098-7654'
      },
      {
        name: 'Scott Lang',
        email: 'scott.lang@starkcorp.com',
        department: 'Tecnologia',
        position: 'Desenvolvedor Senior',
        status: 'active' as const,
        hire_date: '2017-09-10',
        phone: '(11) 99987-6543'
      }
    ];
    
    const employeeIds: Record<string, string> = {};
    
    for (const emp of employees) {
      const { data: empResult, error: empError } = await supabase
        .from('employees')
        .insert({
          name: emp.name,
          email: emp.email,
          department: emp.department,
          position: emp.position,
          status: emp.status,
          hire_date: emp.hire_date,
          phone: emp.phone,
          company_id: companyId
        })
        .select('id')
        .single();
        
      if (empError) {
        console.error(`Error creating employee ${emp.name}:`, empError);
        continue;
      }
      
      employeeIds[emp.name] = empResult.id;
    }
    
    // Create trainings
    const trainings = [
      {
        title: 'Segurança no Trabalho',
        description: 'Treinamento básico de segurança para todos os funcionários',
        type: 'compliance',
        provider: 'Departamento de RH',
        instructor: 'Pepper Potts',
        start_date: '2023-05-15',
        end_date: '2023-05-16',
        status: 'completed',
        company_id: companyId
      },
      {
        title: 'Desenvolvimento Avançado de Software',
        description: 'Técnicas avançadas de programação e arquitetura',
        type: 'technical',
        provider: 'Departamento de Tecnologia',
        instructor: 'Scott Lang',
        start_date: '2023-06-10',
        end_date: '2023-06-14',
        status: 'scheduled',
        company_id: companyId
      },
      {
        title: 'Liderança e Gestão de Equipes',
        description: 'Desenvolvimento de habilidades de liderança',
        type: 'soft_skills',
        provider: 'Consultoria Externa',
        instructor: 'Maria Silva',
        start_date: '2023-07-05',
        end_date: '2023-07-07',
        status: 'scheduled',
        company_id: companyId
      }
    ];
    
    for (const training of trainings) {
      const { error: trainError } = await supabase
        .from('hr_trainings')
        .insert(training);
        
      if (trainError) {
        console.error(`Error creating training ${training.title}:`, trainError);
      }
    }
    
    // Create performance evaluations
    const evaluations = [
      {
        employee_id: employeeIds['Peter Parker'],
        evaluator_id: employeeIds['Tony Stark'],
        company_id: companyId,
        evaluation_date: '2023-04-15',
        evaluation_period: '2022-Q4',
        evaluation_type: 'annual',
        status: 'completed',
        skills_score: 85,
        goals_achievement_score: 90,
        overall_score: 88,
        comments: 'Excelente desempenho técnico, superou expectativas em desenvolvimento.',
        strengths: 'Capacidade técnica, trabalho em equipe, criatividade',
        improvement_areas: 'Comunicação com outras equipes, documentação'
      },
      {
        employee_id: employeeIds['Natasha Romanoff'],
        evaluator_id: employeeIds['Tony Stark'],
        company_id: companyId,
        evaluation_date: '2023-03-10',
        evaluation_period: '2022-Q4',
        evaluation_type: 'annual',
        status: 'completed',
        skills_score: 95,
        goals_achievement_score: 92,
        overall_score: 94,
        comments: 'Desempenho excepcional na gestão da equipe de produção.',
        strengths: 'Liderança, organização, resolução de problemas',
        improvement_areas: 'Delegação de tarefas'
      }
    ];
    
    // Insert each evaluation individually
    for (const evaluation of evaluations) {
      const { error: evalError } = await supabase
        .from('performance_evaluations')
        .insert(evaluation);
        
      if (evalError) {
        console.error(`Error creating evaluation for ${evaluation.employee_id}:`, evalError);
      }
    }
    
    // Create DISC evaluations
    const discEvaluations = [
      {
        employee_id: employeeIds['Tony Stark'],
        primary_type: 'D',
        secondary_type: 'I',
        dominance_score: 90,
        influence_score: 85,
        steadiness_score: 40,
        compliance_score: 60,
        evaluation_date: '2023-02-10',
        company_id: companyId
      },
      {
        employee_id: employeeIds['Bruce Banner'],
        primary_type: 'C',
        secondary_type: 'S',
        dominance_score: 45,
        influence_score: 40,
        steadiness_score: 70,
        compliance_score: 90,
        evaluation_date: '2023-02-15',
        company_id: companyId
      },
      {
        employee_id: employeeIds['Steve Rogers'],
        primary_type: 'S',
        secondary_type: 'D',
        dominance_score: 70,
        influence_score: 60,
        steadiness_score: 85,
        compliance_score: 65,
        evaluation_date: '2023-03-01',
        company_id: companyId
      }
    ];
    
    for (const disc of discEvaluations) {
      const { error: discError } = await supabase
        .from('hr_disc_evaluations')
        .insert(disc);
        
      if (discError) {
        console.error(`Error creating DISC evaluation for ${disc.employee_id}:`, discError);
      }
    }
    
    // Success!
    return true;
    
  } catch (error) {
    console.error("Error generating demo data:", error);
    return false;
  }
};
