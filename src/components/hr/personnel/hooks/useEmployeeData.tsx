
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "../types";
import { JobPosition } from "../../types";

export function useEmployeeData(
  form: UseFormReturn<RequestFormValues>,
  jobPositions: JobPosition[]
) {
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(null);
  
  // Fetch employee data when the employeeId changes
  useEffect(() => {
    const employeeId = form.watch("employeeId");
    if (employeeId) {
      fetchEmployeeData(employeeId);
    } else {
      setSelectedEmployeeData(null);
      form.setValue("currentPosition", "");
      form.setValue("department", "");
    }
  }, [form.watch("employeeId")]);
  
  // Function to fetch employee data
  const fetchEmployeeData = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();
      
      if (error) {
        console.error("Error fetching employee data:", error);
        return;
      }
      
      if (data) {
        setSelectedEmployeeData(data);
        form.setValue("employeeName", data.name);
        form.setValue("currentPosition", data.position);
        form.setValue("department", data.department);
        
        // Find the corresponding job position ID
        const positionMatch = jobPositions.find(
          pos => pos.title.toLowerCase() === data.position.toLowerCase()
        );
        if (positionMatch) {
          form.setValue("position_id", positionMatch.id);
        }
      }
    } catch (error) {
      console.error("Error in employee data fetch:", error);
    }
  };

  return {
    selectedEmployeeData
  };
}
