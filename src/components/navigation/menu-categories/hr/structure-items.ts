
import { BarChartBig, Building2, Users, DollarSign } from "lucide-react";
import { MenuItem } from "../../types";

export const structureItems: MenuItem[] = [
  {
    title: "Estrutura",
    icon: BarChartBig,
    href: "#",
    modulo: "estrutura_org",
    children: [
      { 
        title: "Departamentos", 
        icon: Building2, 
        href: "/human-resources?activeTab=departments", 
        modulo: "departamentos" 
      },
      { 
        title: "Quadro Aprovado", 
        icon: Users, 
        href: "/human-resources?activeTab=positions", 
        modulo: "posicoes" 
      },
      { 
        title: "Plano de Cargos e Salários", 
        icon: DollarSign, 
        href: "/human-resources?activeTab=salary", 
        modulo: "cargos_salarios" 
      },
      { 
        title: "Estrutura Organizacional", 
        icon: BarChartBig, 
        href: "/human-resources?activeTab=organizational-structure", 
        modulo: "organograma" 
      },
    ]
  }
];
