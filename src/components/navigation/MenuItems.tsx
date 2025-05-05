
import { MenuItem } from "./types";
import { dashboardItems } from "./menu-categories/dashboard-items";
import { isoItems } from "./menu-categories/iso-items";
import { strategicItems } from "./menu-categories/strategic-items";
import { processItems } from "./menu-categories/process-items";
import { indicatorsItems } from "./menu-categories/indicators-items";
import { actionItems } from "./menu-categories/action-items";
import { meetingItems } from "./menu-categories/meeting-items";
import { qualityItems } from "./menu-categories/quality-items";
import { hrItems } from "./menu-categories/hr";
import { resourcesItems } from "./menu-categories/resources-items";
import { settingsItems } from "./menu-categories/settings-items";
import { complianceItems } from "./menu-categories/compliance-items";

export type { MenuItem };

// Combine all menu items, but we'll filter out duplicates in the Sidebar component
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
  ...complianceItems,
];

export default menuItems;
