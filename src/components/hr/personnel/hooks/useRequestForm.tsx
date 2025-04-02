
import { useForm } from "react-hook-form";
import { RequestFormValues } from "../types";
import { useEmployeeData } from "./useEmployeeData";
import { JobPosition } from "../../types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDepartments } from "@/hooks/useDepartments";

export function useRequestForm(jobPositions: JobPosition[], onSubmit: (data: RequestFormValues) => void) {
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);
  const { departments } = useDepartments();

  // Initialize form with default values - memoized to prevent unnecessary re-creation
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position_id: "",
      justification: "",
      targetDate: "",
      requester_id: "",
      employeeId: "",
      employeeName: "",
      hireDate: "",
      currentPosition: "",
      proposedPosition: "",
      currentSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      proposedSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      currentSalary: "",
      proposedSalary: "",
      days: "",
      gender: undefined,
      admissionType: "",
      terminationType: "",
      justCause: false,
      noticePeriod: false,
      hr_observation: ""
    }
  });
  
  // Use the employee data hook
  const { selectedEmployeeData } = useEmployeeData(form, jobPositions);
  
  // Memoize department head lookup for better performance
  const departmentHeads = useMemo(() => {
    return departments.reduce((acc, dept) => {
      if (dept.responsible_name) {
        acc[dept.name.toLowerCase()] = {
          name: dept.responsible_name,
          id: dept.responsible_employee_id
        };
      }
      return acc;
    }, {} as Record<string, { name: string, id: string }>);
  }, [departments]);
  
  // Watch for position_id changes to update department and responsible - optimized with useCallback
  const updateDepartmentInfo = useCallback((positionId: string) => {
    if (!positionId) return;
    
    const foundPosition = jobPositions.find(pos => pos.id === positionId);
    setSelectedPosition(foundPosition || null);
    
    if (foundPosition?.department) {
      // Update department field
      form.setValue("department", foundPosition.department);
      
      // Find department head info if available
      const departmentKey = foundPosition.department.toLowerCase();
      const departmentHead = departmentHeads[departmentKey];
      
      if (departmentHead) {
        console.log("Found department head:", departmentHead.name, departmentHead.id);
      }
    }
  }, [form, jobPositions, departmentHeads]);
  
  // Only re-run effect when necessary dependencies change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "position_id") {
        updateDepartmentInfo(value.position_id as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, updateDepartmentInfo]);
  
  // Handle submit wrapped with useCallback to prevent unnecessary re-renders
  const handleSubmit = useCallback(() => {
    return form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);
  
  return {
    form,
    selectedEmployeeData,
    selectedPosition,
    handleSubmit
  };
}
