
/**
 * Demo employee data for Stark Corporation
 */
export const demoEmployeesData = [
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

/**
 * Training data for the demo company
 */
export const demoTrainingData = [
  {
    title: 'Segurança no Trabalho',
    description: 'Treinamento básico de segurança para todos os funcionários',
    type: 'compliance',
    provider: 'Departamento de RH',
    instructor: 'Pepper Potts',
    start_date: '2023-05-15',
    end_date: '2023-05-16',
    status: 'completed'
  },
  {
    title: 'Desenvolvimento Avançado de Software',
    description: 'Técnicas avançadas de programação e arquitetura',
    type: 'technical',
    provider: 'Departamento de Tecnologia',
    instructor: 'Scott Lang',
    start_date: '2023-06-10',
    end_date: '2023-06-14',
    status: 'scheduled'
  },
  {
    title: 'Liderança e Gestão de Equipes',
    description: 'Desenvolvimento de habilidades de liderança',
    type: 'soft_skills',
    provider: 'Consultoria Externa',
    instructor: 'Maria Silva',
    start_date: '2023-07-05',
    end_date: '2023-07-07',
    status: 'scheduled'
  }
];
