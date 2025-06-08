
import { MenuItem } from "@/components/navigation/types";
import { FileText, Target, Cog, Users, AlertTriangle, BarChart3, Calendar, FolderOpen, MessageSquare, UserCheck, Shield, XCircle, Search, FileCheck, AlertCircle } from "lucide-react";

export const isoSubmenuItems: MenuItem[] = [
  {
    title: "Contexto da Organização",
    href: "/organization-context",
    modulo: "iso",
    icon: FileText
  },
  {
    title: "Planejamento Estratégico",
    href: "/strategic-planning",
    modulo: "iso",
    icon: Target
  },
  {
    title: "Processos",
    href: "/processo",
    modulo: "iso",
    icon: Cog
  },
  {
    title: "Recursos Humanos",
    href: "/human-resources",
    modulo: "iso",
    icon: Users
  },
  {
    title: "Gestão de Riscos",
    href: "/risk-management",
    modulo: "iso",
    icon: AlertTriangle
  },
  {
    title: "Indicadores de Desempenho",
    href: "/performance-indicators",
    modulo: "iso",
    icon: BarChart3
  },
  {
    title: "Cronograma de Ações",
    href: "/action-schedule",
    modulo: "iso",
    icon: Calendar
  },
  {
    title: "Documentos",
    href: "/documents",
    modulo: "iso",
    icon: FolderOpen
  },
  {
    title: "Reclamações de Clientes",
    href: "/customer-complaints",
    modulo: "iso",
    icon: MessageSquare
  },
  {
    title: "Avaliação de Fornecedores",
    href: "/supplier-evaluation",
    modulo: "iso",
    icon: UserCheck
  },
  {
    title: "Controle de Qualidade",
    href: "/quality-control",
    modulo: "iso",
    icon: Shield
  },
  {
    title: "Produtos Não Conformes",
    href: "/non-conforming-products",
    modulo: "iso",
    icon: XCircle
  },
  {
    title: "Cronograma de Auditorias",
    href: "/audit-schedule",
    modulo: "iso",
    icon: Search
  },
  {
    title: "Análise Crítica",
    href: "/critical-analysis",
    modulo: "iso",
    icon: FileCheck
  },
  {
    title: "Não Conformidades",
    href: "/non-compliance",
    modulo: "iso",
    icon: AlertCircle
  }
];
