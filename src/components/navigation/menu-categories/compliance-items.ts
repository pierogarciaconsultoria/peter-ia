
import { AlertTriangle, Calendar, CheckSquare, CalendarClock, Check } from "lucide-react";
import { MenuItem } from "../types";

export const complianceItems: MenuItem[] = [
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
];
