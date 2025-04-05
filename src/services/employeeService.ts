
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
}

// Mock data for development
const mockEmployees: Employee[] = [
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

/**
 * Gets all employees
 */
export async function getEmployees(): Promise<Employee[]> {
  try {
    // In a real implementation, we would fetch from Supabase
    // const { data, error } = await supabase.from("employees").select("*");
    // if (error) throw error;
    // return data as Employee[];
    
    // For now, return mock data
    return mockEmployees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

/**
 * Gets only quality inspectors (employees with position "Inspetor de Qualidade")
 */
export async function getQualityInspectors() {
  try {
    // In a real implementation, we would fetch from Supabase with a filter
    // const { data, error } = await supabase
    //   .from("employees")
    //   .select("id, name")
    //   .eq("position", "Inspetor de Qualidade")
    //   .eq("status", "active");
    // if (error) throw error;
    // return data;
    
    // For now, filter the mock data
    return mockEmployees
      .filter(emp => 
        emp.position === "Inspetor de Qualidade" && 
        emp.status === "active"
      )
      .map(emp => ({
        id: emp.id,
        name: emp.name
      }));
  } catch (error) {
    console.error("Error fetching quality inspectors:", error);
    throw error;
  }
}

/**
 * Gets an employee by id
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    // In a real implementation, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from("employees")
    //   .select("*")
    //   .eq("id", id)
    //   .single();
    // if (error) throw error;
    // return data as Employee;
    
    // For now, use the mock data
    const employee = mockEmployees.find(emp => emp.id === id);
    return employee || null;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
}
