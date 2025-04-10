
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

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  modulo?: string; // Chave do módulo para verificação de permissão
  adminOnly?: boolean; // Se o item deve ser mostrado apenas para admins
}

export const menuItems: MenuItem[] = [
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
    modulo: "processo",
  },
  {
    title: "Planejamento Estratégico",
    href: "/strategic-planning",
    icon: TrendingUp,
    modulo: "planejamento_estrategico",
  },
  {
    title: "Contexto da Organização",
    href: "/organization-context",
    icon: Building2,
    modulo: "contexto_organizacao",
  },
  {
    title: "Análise Crítica",
    href: "/critical-analysis",
    icon: BarChart3,
    modulo: "analise_critica",
  },
  {
    title: "Gente e Gestão",
    href: "/human-resources",
    icon: Users,
    modulo: "gente_gestao",
  },
  {
    title: "Reuniões",
    href: "/reunioes",
    icon: Users2,
    modulo: "reunioes",
  },
  {
    title: "Plano de Ação",
    href: "/action-schedule",
    icon: ClipboardList,
    modulo: "plano_acao",
  },
  {
    title: "Não Conformidades",
    href: "/non-compliance",
    icon: AlertTriangle,
    modulo: "nao_conformidades",
  },
  {
    title: "Produtos Não Conformes",
    href: "/non-conforming-products",
    icon: PackageCheck,
    modulo: "produtos_nao_conformes",
  },
  {
    title: "Controle de Qualidade",
    href: "/quality-control",
    icon: ClipboardCheck,
    modulo: "controle_qualidade",
  },
  {
    title: "Auditoria Externa",
    href: "/external-audit",
    icon: Shield,
    modulo: "auditoria_externa",
  },
  {
    title: "Indicadores de Desempenho",
    href: "/performance-indicators",
    icon: BarChart3,
    modulo: "indicadores_desempenho",
  },
  {
    title: "Reclamações de Clientes",
    href: "/customer-complaints",
    icon: MessageSquare,
    modulo: "reclamacoes_clientes",
  },
  {
    title: "Avaliação de Fornecedores",
    href: "/supplier-evaluation",
    icon: Network,
    modulo: "avaliacao_fornecedores",
  },
  {
    title: "Calibração de Equipamentos",
    href: "/equipment-calibration",
    icon: Cog,
    modulo: "calibracao_equipamentos",
  },
  {
    title: "Inspeção de Matéria Prima",
    href: "/raw-material-inspection",
    icon: CheckSquare,
    modulo: "inspecao_materia_prima",
  },
  {
    title: "Agenda de Auditoria",
    href: "/audit-schedule",
    icon: ListChecks,
    modulo: "agenda_auditoria",
  },
  {
    title: "Gestão de Riscos",
    href: "/risk-management",
    icon: AlertTriangle,
    modulo: "gestao_riscos",
  },
  {
    title: "Pesquisa de Satisfação",
    href: "/satisfaction-survey",
    icon: MessageSquare,
    modulo: "pesquisa_satisfacao",
  },
  {
    title: "Documentos",
    href: "/documents",
    icon: FileText,
    modulo: "documentos",
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
    adminOnly: true,
  },
  {
    title: "Ajuda",
    href: "/help",
    icon: HelpCircle,
  },
];
