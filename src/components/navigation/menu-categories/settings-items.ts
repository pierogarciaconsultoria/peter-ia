
import { Settings, CheckSquare } from "lucide-react";
import { MenuItem } from "../types";

export const settingsItems: MenuItem[] = [
  {
    title: "Tarefas",
    icon: CheckSquare,
    href: "/tasks",
    modulo: "tarefas",
  },
  {
    title: "Administração",
    icon: Settings,
    href: "/admin",
    modulo: "admin",
    adminOnly: true,
  },
];
