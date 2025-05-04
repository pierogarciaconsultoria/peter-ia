
import { 
  Users, BarChartBig, BriefcaseBusiness, CheckSquare, 
  UserPlus, FileHeart, AlertCircle, LogOut, UserCircle, 
  ClipboardCheck, BarChart2, DollarSign, Award, Building2
} from "lucide-react";
import { MenuItem } from "../types";

export const hrItems: MenuItem[] = [
  {
    title: "Gente e Gestão",
    icon: Users,
    href: "/human-resources",
    modulo: "rh",
  },
  {
    title: "Estrutura Organizacional",
    icon: BarChartBig,
    href: "#",
    modulo: "estrutura_org",
    children: [
      { 
        title: "Departamentos", 
        icon: Building2, 
        href: "/human-resources/structure/departments", 
        modulo: "departamentos" 
      },
      { 
        title: "Quadro de Posições Aprovadas", 
        icon: Users, 
        href: "/human-resources/structure/positions", 
        modulo: "posicoes" 
      },
      { 
        title: "Plano de Cargos e Salários", 
        icon: DollarSign, 
        href: "/human-resources/structure/salary", 
        modulo: "cargos_salarios" 
      },
      { 
        title: "Organograma", 
        icon: BarChartBig, 
        href: "/human-resources/structure/organizational-structure", 
        modulo: "organograma" 
      },
    ]
  },
  {
    title: "Movimentação de Pessoal",
    icon: UserPlus,
    href: "#",
    modulo: "movimentacao",
    children: [
      { 
        title: "Solicitação de Nova Posição", 
        icon: UserPlus, 
        href: "/human-resources/management/personnel", 
        modulo: "nova_posicao" 
      },
      { 
        title: "Ocorrências", 
        icon: AlertCircle, 
        href: "/human-resources/management/occurrences", 
        modulo: "ocorrencias" 
      },
      { 
        title: "Atestados Médicos", 
        icon: FileHeart, 
        href: "/human-resources/management/medical", 
        modulo: "atestados" 
      },
    ]
  },
  {
    title: "Recrutamento",
    icon: UserPlus,
    href: "#",
    modulo: "recrutamento",
    children: [
      { 
        title: "Recrutamento e Seleção", 
        icon: UserPlus, 
        href: "/human-resources/recruitment/recruitment-selection", 
        modulo: "recrutamento_selecao" 
      },
      { 
        title: "Entrevista de admissão", 
        icon: ClipboardCheck, 
        href: "/human-resources/recruitment/interview", 
        modulo: "entrevista" 
      },
      { 
        title: "Admissão Online", 
        icon: UserPlus, 
        href: "/human-resources/recruitment/online-admission", 
        modulo: "admissao" 
      },
    ]
  },
  {
    title: "Colaboradores",
    icon: Users,
    href: "#",
    modulo: "colaboradores",
    children: [
      { 
        title: "Colaboradores", 
        icon: UserCircle, 
        href: "/human-resources/employees/directory", 
        modulo: "colaboradores" 
      },
      { 
        title: "Integração", 
        icon: UserPlus, 
        href: "/human-resources/employees/onboarding", 
        modulo: "integracao" 
      },
      { 
        title: "Avaliação de Experiência", 
        icon: ClipboardCheck, 
        href: "/human-resources/employees/trial-evaluation", 
        modulo: "avaliacao_experiencia" 
      },
      { 
        title: "Avaliação de Desempenho", 
        icon: BarChart2, 
        href: "/human-resources/employees/performance", 
        modulo: "avaliacao_desempenho" 
      },
      { 
        title: "Custos de Pessoal", 
        icon: DollarSign, 
        href: "/human-resources/employees/employee-costs", 
        modulo: "custos_pessoal" 
      },
    ]
  },
  {
    title: "Desenvolvimento Profissional",
    icon: Award,
    href: "#",
    modulo: "desenvolvimento",
    children: [
      { 
        title: "Avaliação de Perfil DISC", 
        icon: Award, 
        href: "/human-resources/development/disc-assessment", 
        modulo: "disc" 
      },
      { 
        title: "Planos de Desenvolvimento", 
        icon: Award, 
        href: "/human-resources/development/development-plans", 
        modulo: "pdis" 
      },
      { 
        title: "Treinamentos", 
        icon: Award, 
        href: "/human-resources/development/training", 
        modulo: "treinamentos" 
      },
      { 
        title: "Pesquisa de Clima", 
        icon: Award, 
        href: "/human-resources/development/climate", 
        modulo: "clima" 
      },
      { 
        title: "Feedback", 
        icon: Award, 
        href: "/human-resources/development/feedback", 
        modulo: "feedback" 
      },
    ]
  },
  {
    title: "Desligamento",
    icon: LogOut,
    href: "/human-resources/exit",
    modulo: "desligamento",
  }
];
