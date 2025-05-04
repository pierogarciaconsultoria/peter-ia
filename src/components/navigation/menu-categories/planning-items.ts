
import { LineChart, ClipboardCheck, Building, AlertTriangle, Gauge } from "lucide-react";
import { MenuItem } from "../types";

export const planningItems: MenuItem[] = [
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
    title: "Indicadores de Desempenho",
    icon: Gauge,
    href: "/performance-indicators",
    modulo: "indicadores_desempenho",
  },
];
