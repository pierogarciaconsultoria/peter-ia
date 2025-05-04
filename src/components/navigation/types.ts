
import { LucideIcon } from "lucide-react";

export type MenuItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  children?: MenuItem[];
  requiredRole?: string;
  adminOnly?: boolean;
  modulo?: string;
};
