
import { UserPlus, FileText } from "lucide-react";
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
        title: "Entrevista de admissão", 
        icon: FileText, 
        href: "/human-resources?activeTab=interview", 
        modulo: "entrevista_admissao" 
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
