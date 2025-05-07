
import { supabase } from "@/integrations/supabase/client";
import { demoEmployeesData } from "./demoData";

/**
 * Generate employees for the demo company
 * @param companyId The company ID to associate employees with
 * @param departmentIds Object with department names as keys and their IDs as values
 * @param positionIds Object with position titles as keys and their IDs as values
 * @returns Object with employee names as keys and their IDs as values
 */
export const generateEmployees = async (
  companyId: string,
  departmentIds: Record<string, string>,
  positionIds: Record<string, string>
): Promise<Record<string, string>> => {
  const employeeIds: Record<string, string> = {};
  
  for (const emp of demoEmployeesData) {
    try {
      const { data: empResult, error: empError } = await supabase
        .from('employees')
        .insert({
          name: emp.name,
          email: emp.email,
          department: emp.department,
          position: emp.position,
          status: emp.status,
          hire_date: emp.hire_date,
          phone: emp.phone,
          company_id: companyId
        })
        .select('id')
        .single();
        
      if (empError) {
        console.error(`Error creating employee ${emp.name}:`, empError);
        continue;
      }
      
      employeeIds[emp.name] = empResult.id;
    } catch (error) {
      console.error(`Error creating employee ${emp.name}:`, error);
    }
  }
  
  return employeeIds;
};
