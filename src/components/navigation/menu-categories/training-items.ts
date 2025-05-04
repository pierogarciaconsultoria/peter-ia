
import { BookOpen, Award, CalendarDays } from "lucide-react";
import { MenuItem } from "../types";

export const trainingItems: MenuItem[] = [
  {
    title: "Reuniões",
    icon: CalendarDays,
    href: "/reunioes",
    modulo: "reunioes",
  },
  {
    title: "Controle de Treinamento",
    icon: BookOpen,
    href: "/training-control",
    modulo: "controle_treinamento",
  },
  {
    title: "Pesquisa de Satisfação",
    icon: Award,
    href: "/satisfaction-survey",
    modulo: "pesquisa_satisfacao",
  },
];
