
import { FileText } from "lucide-react";
import { MenuItem } from "../types";

export const processItems: MenuItem[] = [
  {
    title: "Processos",
    icon: FileText,
    href: "/processo",
    modulo: "processos",
    // Removed the children array so it directly links to /processo
  },
];
