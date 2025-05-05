
import { MenuItem } from "./types";
import { dashboardItems } from "./menu-categories/dashboard-items";
import { isoItems } from "./menu-categories/iso-items";
import { strategicItems } from "./menu-categories/strategic-items";
import { processItems } from "./menu-categories/process-items";
import { indicatorsItems } from "./menu-categories/indicators-items";
import { actionItems } from "./menu-categories/action-items";
import { meetingItems } from "./menu-categories/meeting-items";
import { qualityItems } from "./menu-categories/quality-items";
import { hrItems } from "./menu-categories/hr"; // Updated import path
import { resourcesItems } from "./menu-categories/resources-items";
import { settingsItems } from "./menu-categories/settings-items";

export type { MenuItem };

export const menuItems: MenuItem[] = [
  ...dashboardItems,
  ...isoItems,
  ...strategicItems,
  ...processItems,
  ...indicatorsItems,
  ...actionItems,
  ...meetingItems,
  ...qualityItems,
  ...hrItems,
  ...resourcesItems,
  ...settingsItems,
];

export default menuItems;
