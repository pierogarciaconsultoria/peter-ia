
import { Check, List, Book, FileText } from "lucide-react";

export const isoItems = [
  {
    title: "Auditoria",
    icon: Check,
    href: "#",
    modulo: "iso",
    children: [
      {
        title: "Programa de auditoria",
        icon: List,
        href: "/audit-program",
        modulo: "iso",
      },
      {
        title: "Plano de auditoria",
        icon: Book,
        href: "/audit-plan",
        modulo: "iso",
      },
      {
        title: "Relatório de Auditoria",
        icon: FileText,
        href: "/audit-report",
        modulo: "iso",
      },
    ],
  },
];
