
import { Users, BriefcaseBusiness, CheckSquare } from "lucide-react";
import { MenuItem } from "../types";

export const hrItems: MenuItem[] = [
  {
    title: "Recursos Humanos",
    icon: Users,
    href: "#",
    modulo: "rh",
    children: [
      { title: "Funcionários", icon: Users, href: "/human-resources/employees", modulo: "rh" },
      { title: "Cargos", icon: BriefcaseBusiness, href: "/human-resources/positions", modulo: "rh" },
      { title: "Solicitações", icon: CheckSquare, href: "/human-resources/requests", modulo: "rh" },
    ],
  },
];
