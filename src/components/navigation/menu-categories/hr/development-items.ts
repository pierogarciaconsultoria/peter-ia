
import { Award } from "lucide-react";
import { MenuItem } from "../../types";

export const developmentItems: MenuItem[] = [
  {
    title: "Desenvolvimento",
    icon: Award,
    href: "#",
    modulo: "desenvolvimento",
    children: [
      { 
        title: "Planos de Desenvolvimento", 
        icon: Award, 
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
        title: "Avaliação de Perfil DISC", 
        icon: Award, 
        href: "/human-resources?activeTab=disc-assessment", 
        modulo: "disc" 
      },
      { 
        title: "Pesquisa de Clima", 
        icon: Award, 
        href: "/human-resources?activeTab=climate", 
        modulo: "clima" 
      },
      { 
        title: "Feedback", 
        icon: Award, 
        href: "/human-resources?activeTab=feedback", 
        modulo: "feedback" 
      },
    ]
  }
];
