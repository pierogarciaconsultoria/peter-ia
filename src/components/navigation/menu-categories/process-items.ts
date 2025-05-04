
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
    title: "ISO Templates",
    icon: FileBox,
    href: "#",
    modulo: "iso",
    children: [
      { title: "ISO 9001:2015", icon: FileBox, href: "/iso-9001", modulo: "iso" },
      { title: "ISO 14001:2015", icon: FileBox, href: "/iso-14001", modulo: "iso" },
      { title: "ISO 45001:2018", icon: FileBox, href: "/iso-45001", modulo: "iso" },
    ],
  },
];
