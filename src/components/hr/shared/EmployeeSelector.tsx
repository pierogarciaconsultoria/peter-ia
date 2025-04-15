
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email?: string;
  status?: string;
}

interface EmployeeSelectorProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  error?: string;
  isLoading?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  showDepartment?: boolean;
  showPosition?: boolean;
  filterActive?: boolean;
  className?: string;
  // Para uso com react-hook-form
  field?: any;
  form?: any;
  name?: string;
}

export function EmployeeSelector({ 
  employeeId, 
  setEmployeeId, 
  error, 
  isLoading: externalLoading = false,
  placeholder = "Selecione um colaborador",
  label = "Colaborador",
  required = false,
  showDepartment = true,
  showPosition = false,
  filterActive = true,
  className = "w-full",
  field,
  form,
  name
}: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('employees')
          .select('id, name, position, department, email, status');
        
        if (filterActive) {
          query = query.eq('status', 'active');
        }
          
        const { data, error } = await query.order('name');
          
        if (error) {
          console.error('Error fetching employees:', error);
          setEmployees([]);
          return;
        }
        
        setEmployees(data || []);
      } catch (error) {
        console.error('Error in employees fetch:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, [filterActive]);
  
  if (loading || externalLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  // Transform employees list into dropdown options
  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: showDepartment 
      ? `${emp.name} - ${emp.department}` 
      : showPosition 
        ? `${emp.name} - ${emp.position}` 
        : emp.name
  }));
  
  // Se estiver usando react-hook-form
  if (form && name) {
    return (
      <FormItem>
        {label && <FormLabel>{label}{required && <span className="text-destructive"> *</span>}</FormLabel>}
        <Select
          onValueChange={(value) => {
            if (field) field.onChange(value);
            if (setEmployeeId) setEmployeeId(value);
          }}
          value={field?.value || ""}
        >
          <FormControl>
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {employeeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    );
  }

  // Versão simplificada sem react-hook-form
  return (
    <div className={className}>
      {label && (
        <div className="text-sm font-medium mb-2">
          {label}{required && <span className="text-destructive"> *</span>}
        </div>
      )}
      <Select 
        value={employeeId || ""} 
        onValueChange={setEmployeeId}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {employeeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm font-medium text-destructive mt-2">{error}</p>}
    </div>
  );
}
