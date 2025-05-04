
import { MenuItem } from "./types";
import { dashboardItems } from "./menu-categories/dashboard-items";
import { processItems } from "./menu-categories/process-items";
import { hrItems } from "./menu-categories/hr-items";
import { complianceItems } from "./menu-categories/compliance-items";
import { planningItems } from "./menu-categories/planning-items";
import { qualityItems } from "./menu-categories/quality-items";
import { trainingItems } from "./menu-categories/training-items";
import { settingsItems } from "./menu-categories/settings-items";

export type { MenuItem };

export const menuItems: MenuItem[] = [
  ...dashboardItems,
  ...processItems,
  ...hrItems,
  ...complianceItems,
  ...planningItems,
  ...qualityItems,
  ...trainingItems,
  ...settingsItems,
];

export default menuItems;
