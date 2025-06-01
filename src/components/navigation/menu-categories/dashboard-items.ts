
import { LayoutDashboard, Brain } from "lucide-react";
import { MenuItem } from "../types";

export const dashboardItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard"
  },
  {
    title: "Análise Inteligente",
    icon: Brain,
    href: "/analise-inteligente"
  }
];
