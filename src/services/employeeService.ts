
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

/**
 * Creates a new employee
 */
export async function createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee | null> {
  try {
    // Set a default company_id if not provided
    const employeeWithCompany = {
      ...employeeData,
      company_id: employeeData.company_id || '00000000-0000-0000-0000-000000000000' // Using a standard UUID
    };
    
    const { data, error } = await supabase
      .from("employees")
      .insert(employeeWithCompany)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating employee:", error);
      return null;
    }
    
    return data as Employee;
  } catch (error) {
    console.error("Error creating employee:", error);
    return null;
  }
}

/**
 * Updates an existing employee
 */
export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
  try {
    // Ensure we don't try to update the company_id if it's not provided
    const updateData = { ...employeeData };
    
    if (!updateData.company_id) {
      delete updateData.company_id;
    }
    
    const { data, error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating employee with id ${id}:`, error);
      return null;
    }
    
    return data as Employee;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    return null;
  }
}

/**
 * Deletes an employee
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error(`Error deleting employee with id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    return false;
  }
}

/**
 * Get employees by department
 */
export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("department", department);
    
    if (error) {
      console.error(`Error fetching employees from department ${department}:`, error);
      // Fallback to mock data
      return mockEmployees.filter(emp => emp.department === department);
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, filter mock data
    return mockEmployees.filter(emp => emp.department === department);
  } catch (error) {
    console.error(`Error fetching employees from department ${department}:`, error);
    // Fallback to mock data in case of exception
    return mockEmployees.filter(emp => emp.department === department);
  }
}

/**
 * Get employees by status
 */
export async function getEmployeesByStatus(status: 'active' | 'inactive' | 'on_leave'): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("status", status);
    
    if (error) {
      console.error(`Error fetching employees with status ${status}:`, error);
      // Fallback to mock data
      return mockEmployees.filter(emp => emp.status === status);
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, filter mock data
    return mockEmployees.filter(emp => emp.status === status);
  } catch (error) {
    console.error(`Error fetching employees with status ${status}:`, error);
    // Fallback to mock data in case of exception
    return mockEmployees.filter(emp => emp.status === status);
  }
}

/**
 * Search employees by name, email, position or department
 */
export async function searchEmployees(searchTerm: string): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`);
    
    if (error) {
      console.error(`Error searching employees with term "${searchTerm}":`, error);
      // Fallback to mock data
      return mockEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, search mock data
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error(`Error searching employees with term "${searchTerm}":`, error);
    // Fallback to mock data in case of exception
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
