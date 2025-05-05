
import { Users, UserCircle, UserPlus, ClipboardCheck, BarChart2, DollarSign } from "lucide-react";
import { MenuItem } from "../../types";

export const employeesItems: MenuItem[] = [
  {
    title: "Colaboradores",
    icon: Users,
    href: "#",
    modulo: "colaboradores",
    children: [
      { 
        title: "Colaboradores", 
        icon: UserCircle, 
        href: "/human-resources?activeTab=directory", 
        modulo: "colaboradores" 
      },
      { 
        title: "Integração", 
        icon: UserPlus, 
        href: "/human-resources?activeTab=onboarding", 
        modulo: "integracao" 
      },
      { 
        title: "Avaliação de Experiência", 
        icon: ClipboardCheck, 
        href: "/human-resources?activeTab=trial-evaluation", 
        modulo: "avaliacao_experiencia" 
      },
      { 
        title: "Avaliação de Desempenho", 
        icon: BarChart2, 
        href: "/human-resources?activeTab=performance", 
        modulo: "avaliacao_desempenho" 
      },
      { 
        title: "Custos de Pessoal", 
        icon: DollarSign, 
        href: "/human-resources?activeTab=employee-costs", 
        modulo: "custos_pessoal" 
      },
    ]
  }
];
