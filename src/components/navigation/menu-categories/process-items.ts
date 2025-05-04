
import { FileText, FileBox } from "lucide-react";
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
  {
    title: "ISO 9001:2015",
    icon: FileBox,
    href: "/iso-9001",
    modulo: "iso"
  },
];
