
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSectionProps } from "../types";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface EmployeeSelectionSectionProps extends FormSectionProps {
  employees: Employee[];
  onEmployeeChange: (employeeId: string) => void;
}

export function EmployeeSelectionSection({ 
  form, 
  employees, 
  onEmployeeChange 
}: EmployeeSelectionSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onEmployeeChange(value);
              }} 
              value={field.value || ""}
            >
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
    </>
  );
}
