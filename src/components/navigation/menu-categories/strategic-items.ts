
import { LineChart, Book, Target, ArrowUp, BarChart3, BarChart4 } from "lucide-react";
import { MenuItem } from "../types";

export const strategicItems: MenuItem[] = [
  {
    title: "Planejamento Estratégico",
    icon: LineChart,
    href: "/strategic-planning",
    modulo: "planejamento_estrategico",
    children: [
      { title: "Missão", icon: Target, href: "/strategic-planning", modulo: "planejamento_estrategico" },
      { title: "Visão", icon: ArrowUp, href: "/strategic-planning", modulo: "planejamento_estrategico" },
      { title: "Valores", icon: Book, href: "/strategic-planning", modulo: "planejamento_estrategico" },
      { title: "SWOT", icon: BarChart3, href: "/strategic-planning", modulo: "planejamento_estrategico" },
      { title: "BSC", icon: BarChart4, href: "/strategic-planning", modulo: "planejamento_estrategico" },
      { title: "Business Plan", icon: LineChart, href: "/strategic-planning", modulo: "planejamento_estrategico" },
    ],
  },
];
