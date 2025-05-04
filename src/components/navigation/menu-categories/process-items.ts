
import { FileText } from "lucide-react";
import { MenuItem } from "../types";

export const processItems: MenuItem[] = [
  {
    title: "Processos",
    icon: FileText,
    href: "#",
    modulo: "processos",
    children: [
      { title: "Mapeamento de Processos", icon: FileText, href: "/process-form", modulo: "processos" },
    ],
  },
];
