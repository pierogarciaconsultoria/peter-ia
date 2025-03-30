
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmployeeSelector } from "../../departments/EmployeeSelector";
import { CalendarDays } from "lucide-react";
import { FormSectionProps } from "./types";

export function EmployeeSection({ form }: FormSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colaborador</FormLabel>
              <FormControl>
                <EmployeeSelector 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setor</FormLabel>
              <FormControl>
                <Input value={field.value} readOnly className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>A partir de</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                  <Input type="date" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias</FormLabel>
              <FormControl>
                <Input placeholder="Número de dias" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Admissão</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                  <Input type="date" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
