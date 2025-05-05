
import { LogOut, FileText } from "lucide-react";
import { MenuItem } from "../../types";

export const exitItems: MenuItem[] = [
  {
    title: "Desligamento",
    icon: LogOut,
    href: "#",
    modulo: "desligamento",
    children: [
      { 
        title: "Entrevistas de Desligamento", 
        icon: FileText, 
        href: "/human-resources?activeTab=exit-interviews", 
        modulo: "entrevistas_desligamento" 
      }
    ]
  }
];
