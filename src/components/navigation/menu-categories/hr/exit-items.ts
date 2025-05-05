
import { LogOut } from "lucide-react";
import { MenuItem } from "../../types";

export const exitItems: MenuItem[] = [
  {
    title: "Desligamento",
    icon: LogOut,
    href: "/human-resources?activeTab=exit",
    modulo: "desligamento",
  }
];
