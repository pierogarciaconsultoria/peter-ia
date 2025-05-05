
import { MenuItem } from "../types";
import { mainHrItem } from "./hr/main-hr-item";
import { structureItems } from "./hr/structure-items";
import { recruitmentItems } from "./hr/recruitment-items";
import { employeesItems } from "./hr/employees-items";
import { developmentItems } from "./hr/development-items";
import { managementItems } from "./hr/management-items";
import { exitItems } from "./hr/exit-items";
import { ambienteItems } from "./hr/ambiente-items";

// Combine all HR-related menu items
export const hrItems: MenuItem[] = [
  ...mainHrItem,
  ...structureItems,
  ...recruitmentItems,
  ...employeesItems,
  ...developmentItems,
  ...managementItems,
  ...exitItems,
  ...ambienteItems
];
