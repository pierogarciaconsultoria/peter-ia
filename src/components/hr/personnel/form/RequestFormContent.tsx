
import React, { useState, useEffect } from "react";
import { RequestFormValues } from "../types";
import { UseFormReturn } from "react-hook-form";
import { JobPosition } from "../../types";
import { MovementTypeSelector, movementTypes } from "./MovementTypeSelector";
import { JustificationSection } from "./JustificationSection";
import { SignatureSection } from "./SignatureSection";
import { RequestDateSection } from "./sections/RequestDateSection";
import { EmployeeSelectionSection } from "./sections/EmployeeSelectionSection";
import { ConditionalSections } from "./sections/ConditionalSections";
import { useEmployees } from "./hooks/useEmployees";

interface RequestFormContentProps {
  form: UseFormReturn<RequestFormValues>;
  jobPositions: JobPosition[];
  onSubmit: () => void;
  selectedPosition?: JobPosition | null;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

export function RequestFormContent({ 
  form, 
  jobPositions, 
  onSubmit,
  selectedPosition 
}: RequestFormContentProps) {
  // Ensure jobPositions is always an array
  const safeJobPositions = Array.isArray(jobPositions) ? jobPositions : [];
  
  // Selected type category
  const selectedType = movementTypes.find(type => type.id === form.watch("type"))?.label || "";
  
  const [requester, setRequester] = useState<Employee | null>(null);
  const { employees, isLoading } = useEmployees();
  
  // Ensure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
  // Set default request date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    form.setValue('requestDate', today);
  }, [form]);

  // Update requester info when requester is selected
  const handleRequesterChange = (requesterId: string) => {
    const selectedRequester = safeEmployees.find(emp => emp.id === requesterId);
    
    if (selectedRequester) {
      setRequester(selectedRequester);
      form.setValue('requester_id', selectedRequester.id);
      form.setValue('department', selectedRequester.department);
    }
  };
  
  // Update employee info when employee is selected
  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = safeEmployees.find(emp => emp.id === employeeId);
    
    if (selectedEmployee) {
      form.setValue('employeeId', selectedEmployee.id);
      form.setValue('employeeName', selectedEmployee.name);
      form.setValue('currentPosition', selectedEmployee.position);
    }
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Request Date and Requester Section */}
      <RequestDateSection 
        form={form} 
        employees={safeEmployees} 
        isLoading={isLoading} 
        requester={requester} 
        onRequesterChange={handleRequesterChange} 
      />

      {/* Movement Type Selection */}
      <MovementTypeSelector form={form} />

      {/* Employee Selection Section */}
      <EmployeeSelectionSection 
        form={form} 
        employees={safeEmployees} 
        onEmployeeChange={handleEmployeeChange} 
      />

      {/* Conditionally rendered sections based on selected type */}
      <ConditionalSections 
        form={form} 
        selectedType={selectedType} 
        jobPositions={safeJobPositions} 
        selectedPosition={selectedPosition} 
      />

      {/* Justification Section */}
      <JustificationSection form={form} />

      {/* Updated Signature Section with HR observation */}
      <SignatureSection form={form} />
    </form>
  );
}
