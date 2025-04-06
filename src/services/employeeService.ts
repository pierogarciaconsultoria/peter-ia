
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
    // Attempt to fetch from Supabase
    const { data, error } = await supabase.from("employees").select("*");
    
    if (error) {
      console.error("Error fetching employees from Supabase:", error);
      // Fallback to mock data
      return mockEmployees;
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, return mock data
    return mockEmployees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    // Fallback to mock data in case of exception
    return mockEmployees;
  }
}

/**
 * Gets only quality inspectors (employees with position "Inspetor de Qualidade")
 */
export async function getQualityInspectors() {
  try {
    // Attempt to fetch from Supabase with appropriate filters
    const { data, error } = await supabase
      .from("employees")
      .select("id, name")
      .eq("position", "Inspetor de Qualidade")
      .eq("status", "active");
    
    if (error) {
      console.error("Error fetching quality inspectors from Supabase:", error);
      // Fallback to filtering mock data
      return mockEmployees
        .filter(emp => 
          emp.position === "Inspetor de Qualidade" && 
          emp.status === "active"
        )
        .map(emp => ({
          id: emp.id,
          name: emp.name
        }));
    }
    
    if (data && data.length > 0) {
      return data;
    }
    
    // If no data returned but no error, return filtered mock data
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
    // Fallback to mock data in case of exception
    return mockEmployees
      .filter(emp => 
        emp.position === "Inspetor de Qualidade" && 
        emp.status === "active"
      )
      .map(emp => ({
        id: emp.id,
        name: emp.name
      }));
  }
}

/**
 * Gets an employee by id
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error(`Error fetching employee with id ${id} from Supabase:`, error);
      // Fallback to mock data
      const employee = mockEmployees.find(emp => emp.id === id);
      return employee || null;
    }
    
    if (data) {
      return data as Employee;
    }
    
    // If no data returned but no error, search in mock data
    const employee = mockEmployees.find(emp => emp.id === id);
    return employee || null;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    // Fallback to mock data in case of exception
    const employee = mockEmployees.find(emp => emp.id === id);
    return employee || null;
  }
}
