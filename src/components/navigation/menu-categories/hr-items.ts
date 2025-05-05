
import { 
  Users, BarChartBig, BriefcaseBusiness, CheckSquare, 
  UserPlus, FileHeart, AlertCircle, LogOut, UserCircle, 
  ClipboardCheck, BarChart2, DollarSign, Award, Building2,
  Calendar, FileText, Thermometer
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
    title: "Estrutura",
    icon: BarChartBig,
    href: "#",
    modulo: "estrutura_org",
    children: [
      { 
        title: "Departamentos", 
        icon: Building2, 
        href: "/human-resources?activeTab=departments", 
        modulo: "departamentos" 
      },
      { 
        title: "Quadro Aprovado", 
        icon: Users, 
        href: "/human-resources?activeTab=positions", 
        modulo: "posicoes" 
      },
      { 
        title: "Plano de Cargos e Salários", 
        icon: DollarSign, 
        href: "/human-resources?activeTab=salary", 
        modulo: "cargos_salarios" 
      },
      { 
        title: "Estrutura Organizacional", 
        icon: BarChartBig, 
        href: "/human-resources?activeTab=organizational-structure", 
        modulo: "organograma" 
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
        href: "/human-resources?activeTab=recruitment-selection", 
        modulo: "recrutamento_selecao" 
      },
      { 
        title: "Admissão Online", 
        icon: UserPlus, 
        href: "/human-resources?activeTab=online-admission", 
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
        href: "/human-resources?activeTab=directory", 
        modulo: "colaboradores" 
      },
      { 
        title: "Integração", 
        icon: UserPlus, 
        href: "/human-resources?activeTab=onboarding", 
        modulo: "integracao" 
      },
      { 
        title: "Avaliação de Experiência", 
        icon: ClipboardCheck, 
        href: "/human-resources?activeTab=trial-evaluation", 
        modulo: "avaliacao_experiencia" 
      },
      { 
        title: "Avaliação de Desempenho", 
        icon: BarChart2, 
        href: "/human-resources?activeTab=performance", 
        modulo: "avaliacao_desempenho" 
      },
      { 
        title: "Custos de Pessoal", 
        icon: DollarSign, 
        href: "/human-resources?activeTab=employee-costs", 
        modulo: "custos_pessoal" 
      },
    ]
  },
  {
    title: "Desenvolvimento",
    icon: Award,
    href: "#",
    modulo: "desenvolvimento",
    children: [
      { 
        title: "Planos de Desenvolvimento", 
        icon: Award, 
        href: "/human-resources?activeTab=development-plans", 
        modulo: "pdis" 
      },
      { 
        title: "Treinamentos", 
        icon: Award, 
        href: "/human-resources?activeTab=training", 
        modulo: "treinamentos" 
      },
      { 
        title: "Avaliação de Perfil DISC", 
        icon: Award, 
        href: "/human-resources?activeTab=disc-assessment", 
        modulo: "disc" 
      },
      { 
        title: "Pesquisa de Clima", 
        icon: Award, 
        href: "/human-resources?activeTab=climate", 
        modulo: "clima" 
      },
      { 
        title: "Feedback", 
        icon: Award, 
        href: "/human-resources?activeTab=feedback", 
        modulo: "feedback" 
      },
    ]
  },
  {
    title: "Gestão",
    icon: BriefcaseBusiness,
    href: "#",
    modulo: "gestao",
    children: [
      { 
        title: "Movimentação de Pessoal", 
        icon: Users, 
        href: "/human-resources?activeTab=personnel", 
        modulo: "movimentacao" 
      },
      { 
        title: "Férias", 
        icon: Calendar, 
        href: "/human-resources?activeTab=vacation", 
        modulo: "ferias" 
      },
      { 
        title: "Ocorrências", 
        icon: AlertCircle, 
        href: "/human-resources?activeTab=occurrences", 
        modulo: "ocorrencias" 
      },
      { 
        title: "Atestados", 
        icon: FileHeart, 
        href: "/human-resources?activeTab=medical", 
        modulo: "atestados" 
      },
      { 
        title: "Mural do Colaborador", 
        icon: FileText, 
        href: "/human-resources?activeTab=board", 
        modulo: "mural" 
      },
      { 
        title: "Termômetro de Maturidade", 
        icon: Thermometer, 
        href: "/human-resources?activeTab=thermometer", 
        modulo: "termometro" 
      },
    ]
  },
  {
    title: "Desligamento",
    icon: LogOut,
    href: "/human-resources?activeTab=exit",
    modulo: "desligamento",
  },
  {
    title: "Ambiente",
    icon: Building2,
    href: "/human-resources?activeTab=ambiente",
    modulo: "ambiente",
  }
];
