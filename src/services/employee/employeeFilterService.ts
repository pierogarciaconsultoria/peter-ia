
import { supabase } from "@/integrations/supabase/client";
import { Employee, mockEmployees } from "./types";

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
