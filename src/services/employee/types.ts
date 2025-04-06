
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

// Mock data for development
export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Carlos Santos",
    email: "carlos.santos@empresa.com",
    position: "Inspetor de Qualidade",
    department: "Qualidade",
    phone: "(11) 97654-3210",
    status: "active",
    hire_date: "2022-03-15"
  },
  {
    id: "2",
    name: "Ana Pereira",
    email: "ana.pereira@empresa.com",
    position: "Inspetor de Qualidade",
    department: "Qualidade",
    phone: "(11) 98765-4321",
    status: "active",
    hire_date: "2021-06-10"
  },
  {
    id: "3",
    name: "Roberto Almeida",
    email: "roberto.almeida@empresa.com",
    position: "Gerente de Qualidade",
    department: "Qualidade",
    phone: "(11) 99876-5432",
    status: "active",
    hire_date: "2020-01-12"
  },
  {
    id: "4",
    name: "Marina Silva",
    email: "marina.silva@empresa.com",
    position: "Inspetor de Qualidade",
    department: "Qualidade",
    phone: "(11) 91234-5678",
    status: "on_leave",
    hire_date: "2021-09-25"
  }
];
