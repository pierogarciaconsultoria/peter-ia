
import {
  Home,
  FileText,
  Users,
  Calendar,
  Settings,
  ClipboardCheck,
  LineChart,
  Award,
  AlertTriangle,
  BookOpen,
  BriefcaseBusiness,
  Gauge,
  LucideIcon,
  CheckSquare,
  BarChart3,
  SlidersHorizontal,
  Building,
  Upload,
  Clipboard,
  FileBox,
  Truck,
  ThumbsUp,
  Cog,
  CalendarDays,
  Check,
  CalendarClock,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  children?: MenuItem[];
  requiredRole?: string;
  adminOnly?: boolean;
  modulo?: string;
};

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    modulo: "dashboard",
  },
  {
    title: "Processos",
    icon: FileText,
    href: "#",
    modulo: "processos",
    children: [
      { title: "Mapeamento de Processos", icon: FileText, href: "/process-form", modulo: "processos" },
    ],
  },
  {
    title: "ISO Templates",
    icon: FileBox,
    href: "#",
    modulo: "iso",
    children: [
      { title: "ISO 9001:2015", icon: FileBox, href: "/iso-9001", modulo: "iso" },
      { title: "ISO 14001:2015", icon: FileBox, href: "/iso-14001", modulo: "iso" },
      { title: "ISO 45001:2018", icon: FileBox, href: "/iso-45001", modulo: "iso" },
    ],
  },
  {
    title: "Recursos Humanos",
    icon: Users,
    href: "#",
    modulo: "rh",
    children: [
      { title: "Funcionários", icon: Users, href: "/human-resources/employees", modulo: "rh" },
      { title: "Cargos", icon: BriefcaseBusiness, href: "/human-resources/positions", modulo: "rh" },
      { title: "Solicitações", icon: Clipboard, href: "/human-resources/requests", modulo: "rh" },
    ],
  },
  {
    title: "Não Conformidades",
    icon: AlertTriangle,
    href: "/non-compliance",
    modulo: "nao_conformidades",
  },
  {
    title: "Plano de Ação",
    icon: Calendar,
    href: "/action-schedule",
    modulo: "plano_acao",
  },
  {
    title: "Auditoria",
    icon: CheckSquare,
    href: "#",
    modulo: "auditoria",
    children: [
      { title: "Cronograma de Auditoria", icon: CalendarClock, href: "/audit-schedule", modulo: "auditoria" },
      { title: "Auditoria Externa", icon: Check, href: "/external-audit", modulo: "auditoria" },
    ],
  },
  {
    title: "Planejamento Estratégico",
    icon: LineChart,
    href: "/strategic-planning",
    modulo: "planejamento_estrategico",
  },
  {
    title: "Análise Crítica",
    icon: ClipboardCheck,
    href: "/critical-analysis",
    modulo: "analise_critica",
  },
  {
    title: "Contexto da Organização",
    icon: Building,
    href: "/organization-context",
    modulo: "contexto_organizacao",
  },
  {
    title: "Gerenciamento de Riscos",
    icon: AlertTriangle,
    href: "/risk-management",
    modulo: "gerenciamento_riscos",
  },
  {
    title: "Reclamações de Clientes",
    icon: ThumbsUp,
    href: "/customer-complaints",
    modulo: "reclamacoes_clientes",
  },
  {
    title: "Indicadores de Desempenho",
    icon: Gauge,
    href: "/performance-indicators",
    modulo: "indicadores_desempenho",
  },
  {
    title: "Controle de Qualidade",
    icon: SlidersHorizontal,
    href: "/quality-control",
    modulo: "controle_qualidade",
  },
  {
    title: "Avaliação de Fornecedores",
    icon: Truck,
    href: "/supplier-evaluation",
    modulo: "avaliacao_fornecedores",
  },
  {
    title: "Reuniões",
    icon: CalendarDays,
    href: "/reunioes",
    modulo: "reunioes",
  },
  {
    title: "Controle de Treinamento",
    icon: BookOpen,
    href: "/training-control",
    modulo: "controle_treinamento",
  },
  {
    title: "Produtos Não Conformes",
    icon: AlertTriangle,
    href: "/non-conforming-products",
    modulo: "produtos_nao_conformes",
  },
  {
    title: "Calibração de Equipamentos",
    icon: Cog,
    href: "/equipment-calibration",
    modulo: "calibracao_equipamentos",
  },
  {
    title: "Inspeção de Matéria Prima",
    icon: BarChart3,
    href: "/raw-material-inspection",
    modulo: "inspecao_materia_prima",
  },
  {
    title: "Pesquisa de Satisfação",
    icon: Award,
    href: "/satisfaction-survey",
    modulo: "pesquisa_satisfacao",
  },
  {
    title: "Ambiente",
    icon: Settings,
    href: "/ambiente",
    modulo: "ambiente",
  },
  {
    title: "Tarefas",
    icon: CheckSquare,
    href: "/tasks",
    modulo: "tarefas",
  },
  {
    title: "Administração",
    icon: Settings,
    href: "/admin",
    modulo: "admin",
    adminOnly: true,
  },
];

export default menuItems;
