import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface ActiveEmployee {
  id: string;
  name: string;
  position: string | null;
  department: string | null;
}

interface UseActiveEmployeesOptions {
  enabled?: boolean;
}

export function getEmployeeIdByName<T extends { id: string; name: string }>(
  employees: T[],
  employeeName?: string | null
) {
  if (!employeeName) return "";
  return employees.find((employee) => employee.name === employeeName)?.id || "";
}

export function getEmployeeNameById<T extends { id: string; name: string }>(
  employees: T[],
  employeeId?: string | null
) {
  if (!employeeId) return "";
  return employees.find((employee) => employee.id === employeeId)?.name || "";
}

export function useActiveEmployees(options: UseActiveEmployeesOptions = {}) {
  const { enabled = true } = options;
  const { userCompany } = useAuth();
  const [employees, setEmployees] = useState<ActiveEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const fetchEmployees = useCallback(async () => {
    if (!enabled) return;

    setLoadingEmployees(true);
    try {
      let query = supabase
        .from("employees")
        .select("id, name, position, department")
        .eq("status", "active")
        .order("name");

      if (userCompany?.id) {
        query = query.eq("company_id", userCompany.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      setEmployees(
        (data || []).map((employee) => ({
          id: employee.id,
          name: employee.name,
          position: employee.position ?? null,
          department: employee.department ?? null,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, [enabled, userCompany?.id]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loadingEmployees,
    refetchEmployees: fetchEmployees,
  };
}
