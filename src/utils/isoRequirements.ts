
export type RequirementStatus = 'not-started' | 'in-progress' | 'review' | 'completed';

export interface ISORequirement {
  id: string;
  number: string;
  title: string;
  description: string;
  status: RequirementStatus;
  progress: number;
  children?: ISORequirement[];
  recommendedActions?: string[];
  evidence?: string[];
}

export const isoRequirements: ISORequirement[] = [
  {
    id: 'context',
    number: '4',
    title: 'Contexto da Organização',
    description: 'Compreensão da organização e seu contexto, partes interessadas e estabelecimento do escopo do SGQ.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'context-org',
        number: '4.1',
        title: 'Compreensão da organização e seu contexto',
        description: 'Determinar questões externas e internas relevantes para o propósito e direção estratégica da organização.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Realizar análise SWOT (Forças, Fraquezas, Oportunidades e Ameaças)',
          'Identificar fatores externos: mercado, concorrência, regulamentações, tecnologia',
          'Identificar fatores internos: cultura, conhecimento, desempenho',
          'Documentar o contexto organizacional'
        ],
        evidence: [
          'Documento de análise SWOT',
          'Registro de fatores externos e internos',
          'Ata de reunião de análise crítica'
        ]
      },
      {
        id: 'context-parties',
        number: '4.2',
        title: 'Compreensão das necessidades e expectativas das partes interessadas',
        description: 'Determinar as partes interessadas e seus requisitos relevantes para o SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar todas as partes interessadas (stakeholders)',
          'Determinar requisitos relevantes de cada parte interessada',
          'Monitorar e analisar periodicamente as informações sobre partes interessadas',
          'Documentar as necessidades e expectativas'
        ],
        evidence: [
          'Matriz de partes interessadas',
          'Registro de requisitos por parte interessada',
          'Plano de comunicação com partes interessadas'
        ]
      },
      {
        id: 'context-scope',
        number: '4.3',
        title: 'Determinação do escopo do sistema de gestão da qualidade',
        description: 'Determinar os limites e a aplicabilidade do SGQ para estabelecer seu escopo.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Definir os limites físicos e organizacionais do SGQ',
          'Identificar produtos e serviços cobertos pelo SGQ',
          'Justificar qualquer requisito da norma considerado não aplicável',
          'Documentar o escopo do SGQ'
        ],
        evidence: [
          'Documento de escopo do SGQ',
          'Justificativa para exclusões (se houver)',
          'Mapa de processos'
        ]
      },
      {
        id: 'context-qms',
        number: '4.4',
        title: 'Sistema de gestão da qualidade e seus processos',
        description: 'Estabelecer, implementar, manter e melhorar continuamente o SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar os processos necessários para o SGQ',
          'Determinar a sequência e interação destes processos',
          'Determinar critérios, métodos e indicadores para operação e controle eficazes',
          'Alocar recursos necessários e atribuir responsabilidades',
          'Abordar riscos e oportunidades conforme requisitos da seção 6.1',
          'Implementar mudanças necessárias para alcançar resultados pretendidos',
          'Melhorar os processos e o SGQ'
        ],
        evidence: [
          'Mapa de processos',
          'Descrição de processos',
          'Procedimentos documentados',
          'Indicadores de desempenho'
        ]
      },
    ],
  },
  {
    id: 'leadership',
    number: '5',
    title: 'Liderança',
    description: 'Demonstração de comprometimento da liderança, estabelecimento de política e designação de papéis e responsabilidades.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'leadership-commitment',
        number: '5.1',
        title: 'Liderança e comprometimento',
        description: 'A Alta Direção deve demonstrar liderança e comprometimento com o SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Assumir responsabilidade pela eficácia do SGQ',
          'Estabelecer política e objetivos da qualidade compatíveis com o contexto e direção estratégica',
          'Integrar os requisitos do SGQ nos processos de negócio',
          'Promover o uso da abordagem de processo e mentalidade de risco',
          'Assegurar disponibilidade de recursos para o SGQ',
          'Comunicar a importância do SGQ e conformidade com seus requisitos',
          'Engajar, dirigir e apoiar pessoas que contribuem para a eficácia do SGQ',
          'Promover melhoria contínua',
          'Apoiar outros papéis gerenciais'
        ],
        evidence: [
          'Atas de reuniões da Alta Direção',
          'Plano de comunicação interna',
          'Registros de disponibilização de recursos',
          'Avaliação de desempenho do SGQ'
        ]
      },
      {
        id: 'leadership-policy',
        number: '5.2',
        title: 'Política',
        description: 'Estabelecer, implementar e manter uma política da qualidade apropriada à organização.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Desenvolver política da qualidade apropriada ao propósito e contexto da organização',
          'Incluir comprometimento com requisitos e melhoria contínua',
          'Fornecer estrutura para objetivos da qualidade',
          'Comunicar, entender e aplicar a política na organização',
          'Disponibilizar a política às partes interessadas',
          'Revisar periodicamente a política'
        ],
        evidence: [
          'Documento da Política da Qualidade',
          'Registros de comunicação da política',
          'Registros de treinamento',
          'Quadros/displays com a política'
        ]
      },
      {
        id: 'leadership-roles',
        number: '5.3',
        title: 'Papéis, responsabilidades e autoridades organizacionais',
        description: 'Assegurar que as responsabilidades e autoridades sejam atribuídas, comunicadas e entendidas.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Definir e atribuir responsabilidades e autoridades para funções relevantes',
          'Assegurar que processos entreguem saídas pretendidas',
          'Designar responsáveis por relatar desempenho do SGQ e oportunidades de melhoria',
          'Promover foco no cliente em toda a organização',
          'Assegurar integridade do SGQ quando mudanças são planejadas e implementadas'
        ],
        evidence: [
          'Organograma',
          'Descrições de cargos/funções',
          'Matriz de responsabilidades',
          'Nomeação formal do representante da direção'
        ]
      },
    ],
  },
  {
    id: 'planning',
    number: '6',
    title: 'Planejamento',
    description: 'Abordagem de riscos e oportunidades, estabelecimento de objetivos da qualidade e planejamento de mudanças.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'planning-risks',
        number: '6.1',
        title: 'Ações para abordar riscos e oportunidades',
        description: 'Determinar riscos e oportunidades que precisam ser abordados para garantir que o SGQ possa alcançar os resultados pretendidos.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar riscos e oportunidades para o SGQ',
          'Avaliar potenciais impactos dos riscos identificados',
          'Planejar ações para abordar riscos e oportunidades',
          'Integrar e implementar ações nos processos do SGQ',
          'Avaliar eficácia das ações tomadas'
        ],
        evidence: [
          'Matriz de riscos e oportunidades',
          'Planos de ação para tratamento de riscos',
          'Análise de eficácia das ações'
        ]
      },
      {
        id: 'planning-objectives',
        number: '6.2',
        title: 'Objetivos da qualidade e planejamento para alcançá-los',
        description: 'Estabelecer objetivos da qualidade nas funções, níveis e processos relevantes.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Estabelecer objetivos da qualidade coerentes com a política e contexto',
          'Assegurar que objetivos sejam mensuráveis',
          'Considerar requisitos aplicáveis',
          'Determinar o que será feito, recursos necessários, responsáveis, prazos',
          'Definir método de avaliação dos resultados',
          'Comunicar objetivos aos colaboradores',
          'Atualizar objetivos quando apropriado'
        ],
        evidence: [
          'Documento com objetivos da qualidade',
          'Plano de ação para alcançar objetivos',
          'Indicadores-chave de desempenho (KPIs)',
          'Relatórios de progresso'
        ]
      },
      {
        id: 'planning-changes',
        number: '6.3',
        title: 'Planejamento de mudanças',
        description: 'Quando mudanças no SGQ forem necessárias, devem ser realizadas de forma planejada.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar propósito e consequências potenciais das mudanças',
          'Assegurar integridade do SGQ durante mudanças',
          'Assegurar disponibilidade de recursos para mudanças',
          'Definir/revisar responsabilidades e autoridades para mudanças',
          'Documentar o plano de mudanças'
        ],
        evidence: [
          'Procedimento de gestão de mudanças',
          'Análise de impacto de mudanças',
          'Planos de implementação',
          'Registros de comunicação de mudanças'
        ]
      },
    ],
  },
  {
    id: 'support',
    number: '7',
    title: 'Apoio',
    description: 'Provimento de recursos, garantia de competência, promoção de conscientização e controle de informação documentada.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'support-resources',
        number: '7.1',
        title: 'Recursos',
        description: 'Determinar e prover recursos necessários para o estabelecimento, implementação, manutenção e melhoria contínua do SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar e prover pessoas necessárias',
          'Determinar, prover e manter infraestrutura necessária',
          'Determinar, prover e manter ambiente adequado para operação de processos',
          'Determinar recursos de monitoramento e medição apropriados',
          'Assegurar rastreabilidade de medições conforme necessário',
          'Determinar e gerir conhecimento organizacional necessário'
        ],
        evidence: [
          'Plano de recursos humanos e materiais',
          'Registros de calibração e verificação de equipamentos',
          'Programas de manutenção de infraestrutura',
          'Base de conhecimento organizacional'
        ]
      },
      {
        id: 'support-competence',
        number: '7.2',
        title: 'Competência',
        description: 'Determinar a competência necessária, assegurar que seja adquirida e tomar ações para adquirir a competência necessária.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Determinar competências necessárias para cada função',
          'Desenvolver processos de seleção e capacitação adequados',
          'Implementar planos de treinamento e desenvolvimento',
          'Avaliar eficácia das ações tomadas',
          'Manter registros de educação, treinamento, habilidades e experiência'
        ],
        evidence: [
          'Descrição de competências por função',
          'Plano de treinamento',
          'Registros de treinamento e avaliação de eficácia',
          'Certificados e qualificações'
        ]
      },
      {
        id: 'support-awareness',
        number: '7.3',
        title: 'Conscientização',
        description: 'Assegurar que pessoas que trabalham sob controle da organização estejam conscientes da política da qualidade, objetivos, sua contribuição e implicações da não conformidade.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Comunicar política da qualidade e objetivos',
          'Promover entendimento da contribuição individual para o SGQ',
          'Conscientizar sobre implicações de não conformidades',
          'Criar programas de conscientização e integração',
          'Realizar verificações de efetividade da conscientização'
        ],
        evidence: [
          'Registros de treinamentos de conscientização',
          'Material de comunicação interna',
          'Pesquisas de clima e conhecimento',
          'Entrevistas com colaboradores'
        ]
      },
      {
        id: 'support-communication',
        number: '7.4',
        title: 'Comunicação',
        description: 'Determinar comunicações internas e externas relevantes para o SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Definir o que, quando, com quem, como e quem realiza comunicações',
          'Estabelecer canais de comunicação eficazes',
          'Assegurar que informações relevantes cheguem aos públicos interessados',
          'Monitorar eficácia da comunicação',
          'Manter registros de comunicações relevantes'
        ],
        evidence: [
          'Procedimento de comunicação',
          'Matriz de comunicação',
          'Quadros de gestão à vista',
          'Registros de reuniões e informativos'
        ]
      },
      {
        id: 'support-documented-info',
        number: '7.5',
        title: 'Informação documentada',
        description: 'O SGQ deve incluir informação documentada requerida pela ISO 9001 e determinada pela organização como necessária para a eficácia do SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar documentos necessários para o SGQ',
          'Criar e atualizar informação documentada com identificação, formato e aprovação adequados',
          'Controlar informação documentada para disponibilidade e proteção',
          'Estabelecer controles para distribuição, acesso, recuperação, uso e preservação',
          'Controlar alterações e retenção de documentos',
          'Identificar e controlar documentos de origem externa'
        ],
        evidence: [
          'Lista mestra de documentos',
          'Procedimento de controle de documentos',
          'Procedimento de controle de registros',
          'Sistema de gestão documental'
        ]
      },
    ],
  },
  {
    id: 'operation',
    number: '8',
    title: 'Operação',
    description: 'Planejamento e controle de operações, definição de requisitos, design de produtos/serviços e controle de provedores externos.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'operation-planning',
        number: '8.1',
        title: 'Planejamento e controle operacionais',
        description: 'Planejar, implementar e controlar processos necessários para atender aos requisitos para produtos e serviços.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Determinar requisitos para produtos e serviços',
          'Estabelecer critérios para processos e aceitação de produtos/serviços',
          'Determinar recursos necessários para conformidade',
          'Implementar controle de processos conforme critérios',
          'Determinar, manter e reter informação documentada',
          'Controlar mudanças planejadas e analisar consequências de mudanças não intencionais',
          'Assegurar controle de processos terceirizados'
        ],
        evidence: [
          'Planos da qualidade',
          'Fluxogramas de processos',
          'Instruções de trabalho',
          'Registros de controle de processo'
        ]
      },
      {
        id: 'operation-requirements',
        number: '8.2',
        title: 'Requisitos para produtos e serviços',
        description: 'Estabelecer processos para comunicação com clientes, determinação de requisitos e análise crítica de requisitos.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Comunicar-se efetivamente com clientes sobre produtos/serviços, consultas, contratos e feedback',
          'Determinar requisitos para produtos/serviços, incluindo legais, regulamentares e organizacionais',
          'Realizar análise crítica antes de comprometer-se a fornecer',
          'Assegurar capacidade de atendimento a requisitos',
          'Documentar resultados da análise crítica e novos requisitos',
          'Informar partes pertinentes sobre requisitos alterados'
        ],
        evidence: [
          'Procedimento de comunicação com clientes',
          'Registros de análise crítica de contratos',
          'Registros de feedback de clientes',
          'Registros de alterações em requisitos'
        ]
      },
      {
        id: 'operation-design',
        number: '8.3',
        title: 'Design e desenvolvimento de produtos e serviços',
        description: 'Estabelecer, implementar e manter um processo de design e desenvolvimento apropriado para assegurar o fornecimento subsequente de produtos e serviços.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Estabelecer estágios e controles para processo de design/desenvolvimento',
          'Determinar requisitos essenciais para tipos de produtos/serviços',
          'Aplicar controles ao processo de design/desenvolvimento',
          'Determinar entradas para requisitos específicos',
          'Aplicar controles para garantir que saídas atendam requisitos de entrada',
          'Identificar, analisar e controlar mudanças durante ou após design',
          'Reter informação documentada sobre processo de design/desenvolvimento'
        ],
        evidence: [
          'Plano de design e desenvolvimento',
          'Registros de entradas e saídas de design',
          'Registros de verificação e validação',
          'Registros de alterações de design'
        ]
      },
      {
        id: 'operation-external',
        number: '8.4',
        title: 'Controle de processos, produtos e serviços providos externamente',
        description: 'Assegurar que processos, produtos e serviços providos externamente estejam conformes com os requisitos.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Estabelecer critérios para avaliação, seleção e monitoramento de fornecedores externos',
          'Determinar controles para produtos/serviços externos',
          'Comunicar aos fornecedores externos requisitos aplicáveis',
          'Verificar que produtos/serviços atendem requisitos especificados',
          'Estabelecer informação documentada para controle de fornecimento externo'
        ],
        evidence: [
          'Procedimento de qualificação de fornecedores',
          'Lista de fornecedores aprovados',
          'Critérios de avaliação de fornecedores',
          'Registros de inspeção de recebimento'
        ]
      },
      {
        id: 'operation-production',
        number: '8.5',
        title: 'Produção e provisão de serviço',
        description: 'Implementar produção e provisão de serviço sob condições controladas.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Implementar controles de produção/provisão de serviço',
          'Utilizar meios adequados para identificação de saídas',
          'Identificar status das saídas em relação a requisitos de monitoramento',
          'Controlar e identificar propriedade de clientes/fornecedores externos',
          'Preservar saídas durante produção/provisão de serviço',
          'Atender requisitos para atividades pós-entrega',
          'Analisar e controlar mudanças na produção/provisão'
        ],
        evidence: [
          'Instruções de trabalho documentadas',
          'Registros de identificação e rastreabilidade',
          'Registros de propriedade do cliente',
          'Procedimentos de preservação de produto'
        ]
      },
      {
        id: 'operation-release',
        number: '8.6',
        title: 'Liberação de produtos e serviços',
        description: 'Implementar arranjos planejados para verificar se os requisitos dos produtos e serviços foram atendidos.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Implementar verificações planejadas de conformidade',
          'Manter evidências de conformidade com critérios de aceitação',
          'Assegurar rastreabilidade a pessoa(s) que autoriza(m) liberação',
          'Não liberar antes de verificações, exceto se aprovado por autoridade e cliente'
        ],
        evidence: [
          'Procedimento de liberação de produto',
          'Registros de inspeção final',
          'Listas de verificação de liberação',
          'Registros de assinaturas de aprovação'
        ]
      },
      {
        id: 'operation-nonconforming',
        number: '8.7',
        title: 'Controle de saídas não conformes',
        description: 'Assegurar que saídas não conformes sejam identificadas e controladas para prevenir uso ou entrega não intencional.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar e controlar saídas não conformes',
          'Tomar ações apropriadas (correção, segregação, informação ao cliente, etc.)',
          'Verificar conformidade após correção de não conformidades',
          'Manter informação documentada sobre não conformidades',
          'Descrever não conformidade, ações tomadas e autoridades'
        ],
        evidence: [
          'Procedimento de controle de não conformidades',
          'Registros de não conformidades',
          'Ações corretivas implementadas',
          'Registros de concessões aprovadas'
        ]
      },
    ],
  },
  {
    id: 'performance',
    number: '9',
    title: 'Avaliação de Desempenho',
    description: 'Monitoramento, medição, análise, avaliação, condução de auditorias internas e análises críticas pela direção.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'performance-monitoring',
        number: '9.1',
        title: 'Monitoramento, medição, análise e avaliação',
        description: 'Determinar o que precisa ser monitorado e medido, e métodos para monitoramento, medição, análise e avaliação.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Determinar o que, como e quando monitorar e medir',
          'Determinar quando resultados devem ser analisados e avaliados',
          'Avaliar desempenho e eficácia do SGQ',
          'Implementar programa de monitoramento de satisfação do cliente',
          'Analisar e avaliar dados e informações do monitoramento',
          'Manter informação documentada como evidência'
        ],
        evidence: [
          'Indicadores de desempenho documentados',
          'Pesquisas de satisfação de clientes',
          'Relatórios de análise de dados',
          'Registros de medições de processos'
        ]
      },
      {
        id: 'performance-audit',
        number: '9.2',
        title: 'Auditoria interna',
        description: 'Conduzir auditorias internas em intervalos planejados para fornecer informações sobre conformidade e implementação eficaz do SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Planejar programa de auditoria (frequência, métodos, responsabilidades, requisitos)',
          'Definir critérios e escopo de cada auditoria',
          'Selecionar auditores objetivos e imparciais',
          'Reportar resultados à gestão relevante',
          'Tomar ações corretivas apropriadas sem demora indevida',
          'Manter informação documentada como evidência de implementação'
        ],
        evidence: [
          'Procedimento de auditoria interna',
          'Programa anual de auditorias',
          'Planos de auditoria individual',
          'Relatórios de auditoria interna',
          'Registros de não conformidades e ações corretivas'
        ]
      },
      {
        id: 'performance-review',
        number: '9.3',
        title: 'Análise crítica pela direção',
        description: 'A Alta Direção deve analisar criticamente o SGQ da organização em intervalos planejados para assegurar sua contínua adequação, suficiência, eficácia e alinhamento com a direção estratégica.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Planejar análises críticas regulares pela direção',
          'Incluir considerações sobre status de ações anteriores',
          'Considerar mudanças em questões internas/externas relevantes',
          'Analisar informações sobre desempenho e eficácia do SGQ',
          'Avaliar adequação de recursos, eficácia de ações e oportunidades de melhoria',
          'Documentar decisões relacionadas a oportunidades e mudanças necessárias',
          'Manter informação documentada como evidência de resultados'
        ],
        evidence: [
          'Agenda de reunião de análise crítica',
          'Atas de reunião de análise crítica',
          'Planos de ação resultantes',
          'Registros de acompanhamento de ações definidas'
        ]
      },
    ],
  },
  {
    id: 'improvement',
    number: '10',
    title: 'Melhoria',
    description: 'Identificação de não conformidades, tomada de ações corretivas e melhoria contínua do SGQ.',
    status: 'not-started',
    progress: 0,
    children: [
      {
        id: 'improvement-general',
        number: '10.1',
        title: 'Generalidades',
        description: 'Determinar e selecionar oportunidades de melhoria e implementar ações necessárias.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Identificar oportunidades para atender requisitos de clientes e aumentar satisfação',
          'Incluir melhoria de produtos/serviços considerando necessidades futuras',
          'Corrigir, prevenir ou reduzir efeitos indesejados',
          'Melhorar desempenho e eficácia do SGQ',
          'Estabelecer programa de sugestões de melhoria'
        ],
        evidence: [
          'Programa de melhoria contínua',
          'Registros de implementação de melhorias',
          'Sistema de sugestões'
        ]
      },
      {
        id: 'improvement-nonconformity',
        number: '10.2',
        title: 'Não conformidade e ação corretiva',
        description: 'Quando ocorrer uma não conformidade, tomar ações para controlá-la e corrigi-la, e lidar com as consequências.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Reagir à não conformidade (tomar ações para controle e correção)',
          'Avaliar necessidade de ação para eliminar causas (analisar, determinar causas, verificar ocorrências similares)',
          'Implementar ações necessárias',
          'Analisar eficácia de ações corretivas tomadas',
          'Atualizar riscos e oportunidades, fazer mudanças no SGQ se necessário',
          'Manter registros de não conformidades e ações subsequentes',
          'Manter registros de resultados de ações corretivas'
        ],
        evidence: [
          'Procedimento de ação corretiva',
          'Registros de não conformidades',
          'Análise de causa raiz',
          'Registros de implementação e verificação de eficácia'
        ]
      },
      {
        id: 'improvement-continual',
        number: '10.3',
        title: 'Melhoria contínua',
        description: 'Melhorar continuamente a adequação, suficiência e eficácia do SGQ.',
        status: 'not-started',
        progress: 0,
        recommendedActions: [
          'Utilizar resultados de análise e avaliação',
          'Utilizar saídas de análise crítica pela direção',
          'Identificar necessidades que poderiam ser tratadas como oportunidades de melhoria',
          'Implementar projetos de melhoria contínua',
          'Medir e documentar benefícios das melhorias implementadas',
          'Disseminar conhecimento sobre melhorias bem-sucedidas'
        ],
        evidence: [
          'Projetos de melhoria documentados',
          'Indicadores de melhoria contínua',
          'Relatórios de boas práticas',
          'Comparativos antes/depois de melhorias'
        ]
      },
    ],
  },
];

