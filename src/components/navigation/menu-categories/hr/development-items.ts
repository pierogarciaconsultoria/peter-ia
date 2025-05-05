
import { Award, FileText } from "lucide-react";
import { MenuItem } from "../../types";

export const developmentItems: MenuItem[] = [
  {
    title: "Desenvolvimento Profissional",
    icon: Award,
    href: "#",
    modulo: "desenvolvimento",
    children: [
      { 
        title: "Avaliação de Perfil DISC", 
        icon: FileText, 
        href: "/human-resources?activeTab=disc-assessment", 
        modulo: "disc" 
      },
      { 
        title: "Planos de Desenvolvimento Individual", 
        icon: FileText, 
        href: "/human-resources?activeTab=development-plans", 
        modulo: "pdis" 
      },
      { 
        title: "Treinamentos", 
        icon: Award, 
        href: "/human-resources?activeTab=training", 
        modulo: "treinamentos" 
      },
      { 
        title: "Pesquisa de Clima Organizacional", 
        icon: FileText, 
        href: "/human-resources?activeTab=climate", 
        modulo: "clima" 
      },
      { 
        title: "Feedback", 
        icon: FileText, 
        href: "/human-resources?activeTab=feedback", 
        modulo: "feedback" 
      },
    ]
  }
];
