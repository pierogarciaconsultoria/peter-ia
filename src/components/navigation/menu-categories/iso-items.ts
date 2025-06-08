
import { FileBox } from "lucide-react";
import { MenuItem } from "../types";
import { isoSubmenuItems } from "../../../iso/navigation/ISOSubmenu";

export const isoItems: MenuItem[] = [
  {
    title: "ISO 9001:2015",
    icon: FileBox,
    href: "/iso-9001",
    modulo: "iso",
    children: isoSubmenuItems
  },
];
