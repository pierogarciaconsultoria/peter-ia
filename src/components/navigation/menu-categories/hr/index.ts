
import { MenuItem } from "../../types";
import { mainHrItem } from "./main-hr-item";

// We're simplifying to only include the main HR item in the sidebar
export const hrItems: MenuItem[] = [
  ...mainHrItem
];
