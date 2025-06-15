
import { Check, FileText, Calendar } from "lucide-react";

export const isoItems = [
  {
    title: "Auditoria",
    icon: Check,
    href: "#",
    modulo: "iso",
    children: [
      {
        title: "Programa de auditoria",
        icon: FileText,
        href: "/audit-management?tab=programa",
        modulo: "iso",
      },
      {
        title: "Plano de auditoria",
        icon: Calendar,
        href: "/audit-management?tab=plano",
        modulo: "iso",
      },
      {
        title: "Relatório de Auditoria",
        icon: FileText,
        href: "/audit-management?tab=relatorio",
        modulo: "iso",
      },
    ],
  },
];
