
import { BriefcaseBusiness, Thermometer } from "lucide-react";
import { MenuItem } from "../../types";

export const managementItems: MenuItem[] = [
  {
    title: "Gestão do Dia a Dia",
    icon: BriefcaseBusiness,
    href: "#",
    modulo: "gestao_dia_dia",
    children: [
      { 
        title: "Férias", 
        icon: BriefcaseBusiness, 
        href: "/human-resources?activeTab=vacation", 
        modulo: "ferias" 
      },
      { 
        title: "Ocorrências", 
        icon: BriefcaseBusiness, 
        href: "/human-resources?activeTab=occurrences", 
        modulo: "ocorrencias" 
      },
      { 
        title: "Atestados Médicos", 
        icon: BriefcaseBusiness, 
        href: "/human-resources?activeTab=medical", 
        modulo: "atestados" 
      },
      { 
        title: "Mural do Colaborador", 
        icon: BriefcaseBusiness, 
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
