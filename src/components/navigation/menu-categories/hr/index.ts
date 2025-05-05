
import { MenuItem } from "../../types";
import { mainHrItem } from "./main-hr-item";
import { structureItems } from "./structure-items";
import { recruitmentItems } from "./recruitment-items";
import { employeesItems } from "./employees-items";
import { developmentItems } from "./development-items";
import { managementItems } from "./management-items";
import { exitItems } from "./exit-items";
import { ambienteItems } from "./ambiente-items";

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
