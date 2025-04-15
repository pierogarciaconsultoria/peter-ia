
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

interface RequestDateSectionProps extends FormSectionProps {
  employees: Employee[];
  isLoading: boolean;
  requester: Employee | null;
  onRequesterChange: (requesterId: string) => void;
}

export function RequestDateSection({ 
  form, 
  employees, 
  isLoading, 
  requester, 
  onRequesterChange 
}: RequestDateSectionProps) {
  return (
    <>
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
                  onRequesterChange(value);
                }} value={field.value || ""}>
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
    </>
  );
}
