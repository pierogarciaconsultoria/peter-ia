
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on_leave';
  avatar_url?: string;
  hire_date: string;
  company_id?: string; // Adding company_id as optional property
}

// Export mock data from the separate file
export { mockEmployees } from './mockData';
