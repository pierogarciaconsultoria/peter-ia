
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface EmployeeSelectorProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  field?: any;
  form?: any;
  name?: string;
  required?: boolean;
  label?: string;
}

export function EmployeeSelector({ 
  employeeId, 
  setEmployeeId, 
  field, 
  form, 
  name = "employee_id",
  required = false,
  label = "Funcionário"
}: EmployeeSelectorProps) {
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
    <FormItem>
      <FormLabel>{label} {required && "*"}</FormLabel>
      <Select 
        onValueChange={setEmployeeId} 
        value={employeeId}
        disabled={loading}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={loading ? "Carregando..." : "Selecione um funcionário"} />
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
  );
}
