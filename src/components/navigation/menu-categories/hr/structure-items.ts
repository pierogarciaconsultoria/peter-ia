
import { BarChartBig, Building2, Users, DollarSign } from "lucide-react";
import { MenuItem } from "../../types";

export const structureItems: MenuItem[] = [
  {
    title: "Estrutura Organizacional",
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
        title: "Quadro de Posições Aprovadas", 
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
        title: "Movimentação de Pessoal", 
        icon: Users, 
        href: "/human-resources?activeTab=personnel", 
        modulo: "movimentacao_pessoal" 
      },
    ]
  }
];
