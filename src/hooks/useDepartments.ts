
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  responsible_employee_id: string | null;
  approved_headcount?: number;
  current_headcount?: number;
  responsible_name?: string; // Added this property
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("*, employees:employees(id, name)")
        .order("name");
      
      if (error) throw error;
      
      // Process the data to include current headcount and responsible name
      const processedDepartments = data.map((dept: any) => {
        const responsibleEmployee = dept.employees?.length > 0 ? dept.employees[0] : null;
        
        return {
          ...dept,
          current_headcount: dept.employees ? dept.employees.length : 0,
          approved_headcount: dept.approved_headcount || 0,
          responsible_name: responsibleEmployee?.name || null
        };
      });
      
      setDepartments(processedDepartments);
    } catch (err: any) {
      console.error("Error fetching departments:", err);
      setError(err.message || "Erro ao carregar departamentos");
      toast({
        title: "Erro ao carregar departamentos",
        description: "Não foi possível carregar a lista de departamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    isLoading,
    error,
    refetch: fetchDepartments,
  };
}
