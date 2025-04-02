
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

export function EmployeeSection({ form }: { form: UseFormReturn<RequestFormValues> }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requester, setRequester] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Update employee info when employee is selected
  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    
    if (selectedEmployee) {
      form.setValue('employeeId', selectedEmployee.id);
      form.setValue('employeeName', selectedEmployee.name);
      form.setValue('currentPosition', selectedEmployee.position);
      form.setValue('department', selectedEmployee.department);
    }
  };

  // Update requester info when requester is selected
  const handleRequesterChange = (requesterId: string) => {
    const selectedRequester = employees.find(emp => emp.id === requesterId);
    
    if (selectedRequester) {
      setRequester(selectedRequester);
      form.setValue('requester_id', selectedRequester.id);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Requester Selection */}
      <FormField
        control={form.control}
        name="requester_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requisitante</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              handleRequesterChange(value);
            }} value={field.value || "default"}>
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

      {/* Requester Department Info */}
      {requester && (
        <div className="bg-muted/20 p-2 rounded-md text-sm">
          <p><span className="font-medium">Departamento:</span> {requester.department}</p>
          <p><span className="font-medium">Cargo:</span> {requester.position}</p>
        </div>
      )}

      {/* Employee Selection */}
      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              handleEmployeeChange(value);
            }} value={field.value || "default"}>
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
    </div>
  );
}
