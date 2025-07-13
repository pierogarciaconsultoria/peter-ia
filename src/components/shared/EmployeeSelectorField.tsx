import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface EmployeeSelectorFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function EmployeeSelectorField({ 
  control,
  name,
  label = "Responsável",
  placeholder = "Selecione um colaborador",
  required = false,
  className = ""
}: EmployeeSelectorFieldProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { userCompany } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let query = supabase
          .from('employees')
          .select('id, name, position, department')
          .eq('status', 'active')
          .order('name');

        if (userCompany?.id) {
          query = query.eq('company_id', userCompany.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [userCompany]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || ""}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Carregando..." : placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  <div className="flex flex-col">
                    <span>{employee.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {employee.position} - {employee.department}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}