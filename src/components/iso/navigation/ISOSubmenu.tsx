
import React from 'react';
import { MenuItem } from '@/components/navigation/types';
import { 
  FileText, 
  Building2, 
  Target, 
  Settings, 
  Users, 
  Cog, 
  Activity, 
  BarChart3, 
  TrendingUp 
} from 'lucide-react';

export const isoSubmenuItems: MenuItem[] = [
  {
    title: "Visão Geral ISO 9001:2015",
    icon: FileText,
    href: "/iso-9001",
    modulo: "iso"
  },
  {
    title: "4. Contexto da Organização",
    icon: Building2,
    href: "/organization-context",
    modulo: "iso",
    children: [
      {
        title: "4.1 Contexto Organizacional",
        icon: Building2,
        href: "/organization-context",
        modulo: "iso"
      },
      {
        title: "4.2 Partes Interessadas", 
        icon: Users,
        href: "/organization-context",
        modulo: "iso"
      },
      {
        title: "4.3 Escopo do SGQ",
        icon: Target,
        href: "/strategic-planning",
        modulo: "iso"
      },
      {
        title: "4.4 Processos do SGQ",
        icon: Cog,
        href: "/processo",
        modulo: "iso"
      }
    ]
  },
  {
    title: "5. Liderança",
    icon: Users,
    href: "/critical-analysis",
    modulo: "iso",
    children: [
      {
        title: "5.1 Liderança e Comprometimento",
        icon: Users,
        href: "/critical-analysis",
        modulo: "iso"
      },
      {
        title: "5.2 Política da Qualidade",
        icon: FileText,
        href: "/strategic-planning",
        modulo: "iso"
      },
      {
        title: "5.3 Papéis e Responsabilidades",
        icon: Users,
        href: "/human-resources",
        modulo: "iso"
      }
    ]
  },
  {
    title: "6. Planejamento",
    icon: Target,
    href: "/strategic-planning",
    modulo: "iso",
    children: [
      {
        title: "6.1 Riscos e Oportunidades",
        icon: Activity,
        href: "/risk-management",
        modulo: "iso"
      },
      {
        title: "6.2 Objetivos da Qualidade",
        icon: Target,
        href: "/performance-indicators",
        modulo: "iso"
      },
      {
        title: "6.3 Planejamento de Mudanças",
        icon: TrendingUp,
        href: "/action-schedule",
        modulo: "iso"
      }
    ]
  },
  {
    title: "7. Apoio",
    icon: Settings,
    href: "/human-resources",
    modulo: "iso",
    children: [
      {
        title: "7.1 Recursos",
        icon: Settings,
        href: "/human-resources",
        modulo: "iso"
      },
      {
        title: "7.2 Competência",
        icon: Users,
        href: "/human-resources",
        modulo: "iso"
      },
      {
        title: "7.5 Informação Documentada",
        icon: FileText,
        href: "/documents",
        modulo: "iso"
      }
    ]
  },
  {
    title: "8. Operação",
    icon: Cog,
    href: "/quality-control",
    modulo: "iso",
    children: [
      {
        title: "8.2 Requisitos de Clientes",
        icon: Users,
        href: "/customer-complaints",
        modulo: "iso"
      },
      {
        title: "8.4 Fornecedores Externos",
        icon: Building2,
        href: "/supplier-evaluation",
        modulo: "iso"
      },
      {
        title: "8.5 Produção de Serviços",
        icon: Cog,
        href: "/quality-control",
        modulo: "iso"
      },
      {
        title: "8.7 Saídas Não Conformes",
        icon: Activity,
        href: "/non-conforming-products",
        modulo: "iso"
      }
    ]
  },
  {
    title: "9. Avaliação de Desempenho",
    icon: BarChart3,
    href: "/performance-indicators",
    modulo: "iso",
    children: [
      {
        title: "9.1 Monitoramento e Medição",
        icon: BarChart3,
        href: "/performance-indicators",
        modulo: "iso"
      },
      {
        title: "9.2 Auditoria Interna",
        icon: FileText,
        href: "/audit-schedule",
        modulo: "iso"
      },
      {
        title: "9.3 Análise Crítica",
        icon: TrendingUp,
        href: "/critical-analysis",
        modulo: "iso"
      }
    ]
  },
  {
    title: "10. Melhoria",
    icon: TrendingUp,
    href: "/action-schedule",
    modulo: "iso",
    children: [
      {
        title: "10.2 Não Conformidade",
        icon: Activity,
        href: "/non-compliance",
        modulo: "iso"
      },
      {
        title: "10.3 Melhoria Contínua",
        icon: TrendingUp,
        href: "/action-schedule",
        modulo: "iso"
      }
    ]
  }
];
