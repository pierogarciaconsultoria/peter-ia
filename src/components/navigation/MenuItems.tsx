
import {
  BarChart3,
  Building2,
  Calendar,
  CheckSquare,
  Cog,
  File,
  Home,
  ListChecks,
  LucideIcon,
  Network,
  ScrollText,
  User2,
  Users,
  AlertTriangle,
  PackageCheck,
  LayoutDashboard,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
  HelpCircle,
  GitBranch,
  ClipboardCheck,
  ClipboardList,
  Shield,
  Video,
  Users2
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Landing Page",
    href: "/landing",
    icon: Home,
  },
  {
    title: "Processo",
    href: "/processo",
    icon: GitBranch,
  },
  {
    title: "Planejamento Estratégico",
    href: "/strategic-planning",
    icon: TrendingUp,
  },
  {
    title: "Contexto da Organização",
    href: "/organization-context",
    icon: Building2,
  },
  {
    title: "Análise Crítica",
    href: "/critical-analysis",
    icon: BarChart3,
  },
  {
    title: "Gente e Gestão",
    href: "/human-resources",
    icon: Users,
  },
  {
    title: "Reuniões",
    href: "/reunioes",
    icon: Users2,
  },
  {
    title: "Plano de Ação",
    href: "/action-schedule",
    icon: ClipboardList,
  },
  {
    title: "Não Conformidades",
    href: "/non-compliance",
    icon: AlertTriangle,
  },
  {
    title: "Produtos Não Conformes",
    href: "/non-conforming-products",
    icon: PackageCheck,
  },
  {
    title: "Controle de Qualidade",
    href: "/quality-control",
    icon: ClipboardCheck,
  },
  {
    title: "Auditoria Externa",
    href: "/external-audit",
    icon: Shield,
  },
  {
    title: "Indicadores de Desempenho",
    href: "/performance-indicators",
    icon: BarChart3,
  },
  {
    title: "Reclamações de Clientes",
    href: "/customer-complaints",
    icon: MessageSquare,
  },
  {
    title: "Avaliação de Fornecedores",
    href: "/supplier-evaluation",
    icon: Network,
  },
  {
    title: "Calibração de Equipamentos",
    href: "/equipment-calibration",
    icon: Cog,
  },
  {
    title: "Inspeção de Matéria Prima",
    href: "/raw-material-inspection",
    icon: CheckSquare,
  },
  {
    title: "Agenda de Auditoria",
    href: "/audit-schedule",
    icon: ListChecks,
  },
  {
    title: "Gestão de Riscos",
    href: "/risk-management",
    icon: AlertTriangle,
  },
  {
    title: "Pesquisa de Satisfação",
    href: "/satisfaction-survey",
    icon: MessageSquare,
  },
  {
    title: "Documentos",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
  },
  {
    title: "Ajuda",
    href: "/help",
    icon: HelpCircle,
  },
];
