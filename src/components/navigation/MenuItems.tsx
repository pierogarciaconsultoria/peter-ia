import {
  BarChart3,
  Building2,
  Calendar,
  CheckSquare,
  Cog6Tooth,
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
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

// Adicionar um novo item no menu para a home/landing page
export const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
    title: "Gestão de Pessoas",
    href: "/human-resources",
    icon: Users,
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
    icon: Cog6Tooth,
  },
  {
    title: "Inspeção de Matéria Prima",
    href: "/raw-material-inspection",
    icon: CheckSquare,
  },
  {
    title: "Controle de Treinamento",
    href: "/training-control",
    icon: User2,
  },
  {
    title: "Agenda de Ações",
    href: "/action-schedule",
    icon: Calendar,
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
    title: "Upload de Documentos",
    href: "/document-upload",
    icon: File,
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
