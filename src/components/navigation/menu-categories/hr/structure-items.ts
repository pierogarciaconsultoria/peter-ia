
import { BarChartBig, Building2, Users, DollarSign, ArrowRightLeft } from "lucide-react";
import { MenuItem } from "../../types";

export const structureItems: MenuItem[] = [
  {
    title: "Organização",
    icon: BarChartBig,
    href: "#",
    modulo: "organizacao",
    children: [
      { 
        title: "Departamentos", 
        icon: Building2, 
        href: "/human-resources?activeTab=departments", 
        modulo: "departamentos" 
      },
      { 
        title: "Posições Aprovadas", 
        icon: Users, 
        href: "/human-resources?activeTab=positions", 
        modulo: "posicoes" 
      },
      { 
        title: "Cargos e Salários", 
        icon: DollarSign, 
        href: "/human-resources?activeTab=salary", 
        modulo: "cargos_salarios" 
      },
      { 
        title: "Movimentação de Pessoal", 
        icon: ArrowRightLeft, 
        href: "/human-resources?activeTab=personnel", 
        modulo: "movimentacao_pessoal" 
      },
    ]
  }
];
