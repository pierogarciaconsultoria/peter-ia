
import { ThumbsUp, SlidersHorizontal, Truck, BarChart3, AlertTriangle, Cog } from "lucide-react";
import { MenuItem } from "../types";

export const qualityItems: MenuItem[] = [
  {
    title: "Reclamações de Clientes",
    icon: ThumbsUp,
    href: "/customer-complaints",
    modulo: "reclamacoes_clientes",
  },
  {
    title: "Controle de Qualidade",
    icon: SlidersHorizontal,
    href: "/quality-control",
    modulo: "controle_qualidade",
  },
  {
    title: "Avaliação de Fornecedores",
    icon: Truck,
    href: "/supplier-evaluation",
    modulo: "avaliacao_fornecedores",
  },
  {
    title: "Produtos Não Conformes",
    icon: AlertTriangle,
    href: "/non-conforming-products",
    modulo: "produtos_nao_conformes",
  },
  {
    title: "Calibração de Equipamentos",
    icon: Cog,
    href: "/equipment-calibration",
    modulo: "calibracao_equipamentos",
  },
  {
    title: "Inspeção de Matéria Prima",
    icon: BarChart3,
    href: "/raw-material-inspection",
    modulo: "inspecao_materia_prima",
  },
];
