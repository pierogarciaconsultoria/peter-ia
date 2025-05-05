
import { UserPlus } from "lucide-react";
import { MenuItem } from "../../types";

export const recruitmentItems: MenuItem[] = [
  {
    title: "Recrutamento",
    icon: UserPlus,
    href: "#",
    modulo: "recrutamento",
    children: [
      { 
        title: "Recrutamento e Seleção", 
        icon: UserPlus, 
        href: "/human-resources?activeTab=recruitment-selection", 
        modulo: "recrutamento_selecao" 
      },
      { 
        title: "Admissão Online", 
        icon: UserPlus, 
        href: "/human-resources?activeTab=online-admission", 
        modulo: "admissao" 
      },
    ]
  }
];
