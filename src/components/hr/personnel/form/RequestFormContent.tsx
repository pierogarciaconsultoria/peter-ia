
import React from "react";
import { RequestFormValues } from "../types";
import { UseFormReturn } from "react-hook-form";
import { JobPosition } from "../../types";
import { MovementTypeSelector, movementTypes } from "./MovementTypeSelector";
import { EmployeeSection } from "./EmployeeSection";
import { PositionSection } from "./PositionSection";
import { ScheduleSection } from "./ScheduleSection";
import { AdmissionSection } from "./AdmissionSection";
import { TerminationSection } from "./TerminationSection";
import { SalarySection } from "./SalarySection";
import { JustificationSection } from "./JustificationSection";
import { SignatureSection } from "./SignatureSection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  // Selected type category
  const selectedType = movementTypes.find(type => type.id === form.watch("type"))?.label || "";
  const isAdmission = selectedType === "Admissão";
  const isTermination = selectedType === "Demissão";
  const isSalaryChange = selectedType === "Aumento salarial";
  const isPositionChange = selectedType === "Mudança de cargo";
  const isScheduleChange = selectedType === "Mudança de horário";

  const showPositionSection = isAdmission || isPositionChange || isSalaryChange;
  const showScheduleSection = isAdmission || isScheduleChange;
  const showSalarySection = isAdmission || isSalaryChange;
  const showAdmissionSection = isAdmission;
  const showTerminationSection = isTermination;
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requester, setRequester] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Set default request date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    form.setValue('requestDate', today);
  }, [form]);
  
  // Fetch employees from Supabase
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active');
          
        if (error) {
          console.error('Error fetching employees:', error);
          return;
        }
        
        if (data) {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error in employees fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Update requester info when requester is selected
  const handleRequesterChange = (requesterId: string) => {
    const selectedRequester = employees.find(emp => emp.id === requesterId);
    
    if (selectedRequester) {
      setRequester(selectedRequester);
      form.setValue('requester_id', selectedRequester.id);
      form.setValue('department', selectedRequester.department);
    }
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Request Date Field */}
      <div className="flex flex-row gap-4 items-end">
        {/* Requester Selection */}
        <div className="flex-1">
          <FormField
            control={form.control}
            name="requester_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requisitante</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  handleRequesterChange(value);
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o requisitante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Request Date */}
        <div className="w-48">
          <FormField
            control={form.control}
            name="requestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da solicitação</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Requester Department Info */}
      {requester && (
        <div className="bg-muted/20 p-2 rounded-md text-sm">
          <p><span className="font-medium">Departamento:</span> {requester.department}</p>
          <p><span className="font-medium">Cargo:</span> {requester.position}</p>
        </div>
      )}

      {/* Movement Type Selection */}
      <MovementTypeSelector form={form} />

      {/* Employee Section with only the employee selector */}
      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              const selectedEmployee = employees.find(emp => emp.id === value);
              
              if (selectedEmployee) {
                form.setValue('employeeId', selectedEmployee.id);
                form.setValue('employeeName', selectedEmployee.name);
                form.setValue('currentPosition', selectedEmployee.position);
              }
            }} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="targetDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data prevista para movimentação</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Position Section - conditionally shown */}
      {showPositionSection && (
        <PositionSection 
          form={form} 
          jobPositions={jobPositions} 
          selectedPosition={selectedPosition}
        />
      )}

      {/* Schedule Section - conditionally shown */}
      {showScheduleSection && (
        <ScheduleSection form={form} />
      )}

      {/* Admission Section - conditionally shown */}
      {showAdmissionSection && (
        <AdmissionSection form={form} />
      )}

      {/* Termination Section - conditionally shown */}
      {showTerminationSection && (
        <TerminationSection form={form} />
      )}

      {/* Salary Section - conditionally shown */}
      {showSalarySection && (
        <SalarySection form={form} />
      )}

      {/* Justification Section */}
      <JustificationSection form={form} />

      {/* Updated Signature Section with HR observation */}
      <SignatureSection form={form} />
    </form>
  );
}
