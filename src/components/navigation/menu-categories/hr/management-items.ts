
import { BriefcaseBusiness, Calendar, AlertCircle, FileHeart, FileText, Thermometer } from "lucide-react";
import { MenuItem } from "../../types";

// Removo a movimentação de pessoal daqui, pois ela agora está em estrutura organizacional
export const managementItems: MenuItem[] = [
  {
    title: "Gestão",
    icon: BriefcaseBusiness,
    href: "#",
    modulo: "gestao",
    children: [
      { 
        title: "Férias", 
        icon: Calendar, 
        href: "/human-resources?activeTab=vacation", 
        modulo: "ferias" 
      },
      { 
        title: "Ocorrências", 
        icon: AlertCircle, 
        href: "/human-resources?activeTab=occurrences", 
        modulo: "ocorrencias" 
      },
      { 
        title: "Atestados", 
        icon: FileHeart, 
        href: "/human-resources?activeTab=medical", 
        modulo: "atestados" 
      },
      { 
        title: "Mural do Colaborador", 
        icon: FileText, 
        href: "/human-resources?activeTab=board", 
        modulo: "mural" 
      },
      { 
        title: "Termômetro de Maturidade", 
        icon: Thermometer, 
        href: "/human-resources?activeTab=thermometer", 
        modulo: "termometro" 
      },
    ]
  }
];
