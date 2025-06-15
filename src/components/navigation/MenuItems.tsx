import { MenuItem } from "./types";
import { dashboardItems } from "./menu-categories/dashboard-items";
import { diagnosticItems } from "./menu-categories/diagnostic-items";
import { strategicItems } from "./menu-categories/strategic-items";
import { processItems } from "./menu-categories/process-items";
import { indicatorsItems } from "./menu-categories/indicators-items";
import { actionItems } from "./menu-categories/action-items";
import { meetingItems } from "./menu-categories/meeting-items";
import { qualityItems } from "./menu-categories/quality-items";
import { hrItems } from "./menu-categories/hr";
import { resourcesItems } from "./menu-categories/resources-items";
import { settingsItems } from "./menu-categories/settings-items";
// import { complianceItems } from "./menu-categories/compliance-items"; // Removido

export type { MenuItem };

export const menuItems: MenuItem[] = [
  ...dashboardItems,
  ...diagnosticItems,
  ...strategicItems,
  ...processItems,
  ...indicatorsItems,
  ...actionItems,
  ...meetingItems,
  ...qualityItems,
  ...hrItems,
  ...resourcesItems,
  ...settingsItems,
  // ...complianceItems, // Removido
];

export default menuItems;
