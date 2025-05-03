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
};

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Processos",
    icon: FileText,
    href: "#",
    children: [
      { title: "Mapeamento de Processos", icon: FileText, href: "/process-form" },
    ],
  },
  {
    title: "ISO Templates",
    icon: FileBox,
    href: "#",
    children: [
      { title: "ISO 9001:2015", icon: FileBox, href: "/iso-9001" },
      { title: "ISO 14001:2015", icon: FileBox, href: "/iso-14001" },
      { title: "ISO 45001:2018", icon: FileBox, href: "/iso-45001" },
    ],
  },
  {
    title: "Recursos Humanos",
    icon: Users,
    href: "#",
    children: [
      { title: "Funcionários", icon: Users, href: "/human-resources/employees" },
      { title: "Cargos", icon: BriefcaseBusiness, href: "/human-resources/positions" },
      { title: "Solicitações", icon: Clipboard, href: "/human-resources/requests" },
    ],
  },
  {
    title: "Não Conformidades",
    icon: AlertTriangle,
    href: "/non-compliance",
  },
  {
    title: "Plano de Ação",
    icon: Calendar,
    href: "/action-schedule",
  },
  {
    title: "Auditoria",
    icon: CheckSquare,
    href: "#",
    children: [
      { title: "Cronograma de Auditoria", icon: CalendarClock, href: "/audit-schedule" },
      { title: "Auditoria Externa", icon: Check, href: "/external-audit" },
    ],
  },
  {
    title: "Planejamento Estratégico",
    icon: LineChart,
    href: "/strategic-planning",
  },
  {
    title: "Análise Crítica",
    icon: ClipboardCheck,
    href: "/critical-analysis",
  },
  {
    title: "Contexto da Organização",
    icon: Building,
    href: "/organization-context",
  },
  {
    title: "Gerenciamento de Riscos",
    icon: AlertTriangle,
    href: "/risk-management",
  },
  {
    title: "Reclamações de Clientes",
    icon: ThumbsUp,
    href: "/customer-complaints",
  },
  {
    title: "Indicadores de Desempenho",
    icon: Gauge,
    href: "/performance-indicators",
  },
  {
    title: "Controle de Qualidade",
    icon: SlidersHorizontal,
    href: "/quality-control",
  },
  {
    title: "Avaliação de Fornecedores",
    icon: Truck,
    href: "/supplier-evaluation",
  },
  {
    title: "Reuniões",
    icon: CalendarDays,
    href: "/reunioes",
  },
  {
    title: "Controle de Treinamento",
    icon: BookOpen,
    href: "/training-control",
  },
  {
    title: "Produtos Não Conformes",
    icon: AlertTriangle,
    href: "/non-conforming-products",
  },
  {
    title: "Calibração de Equipamentos",
    icon: Cog,
    href: "/equipment-calibration",
  },
  {
    title: "Inspeção de Matéria Prima",
    icon: BarChart3,
    href: "/raw-material-inspection",
  },
  {
    title: "Pesquisa de Satisfação",
    icon: Award,
    href: "/satisfaction-survey",
  },
  {
    title: "Ambiente",
    icon: Settings,
    href: "/ambiente",
  },
  {
    title: "Tarefas",
    icon: CheckSquare,
    href: "/tasks",
  },
];

export default menuItems;
