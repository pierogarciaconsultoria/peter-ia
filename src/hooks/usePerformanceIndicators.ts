
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PerformanceIndicator = {
  id: string;
  name: string;
};

export function usePerformanceIndicators(company_id?: string) {
  const [indicators, setIndicators] = useState<PerformanceIndicator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!company_id) {
      setIndicators([]);
      return;
    }
    setLoading(true);

    async function fetchIndicators() {
      // Query SQL crua evita qualquer inferência profunda do TS
      const sql = `
        select id::text, name::text
        from performance_indicators
        where company_id = $1
      `;
      const { data, error } = await supabase.rpc("execute_sql_with_schema", {
        sql_statement: sql,
        target_schema: "public",
        params: [company_id],
      });
      if (!isMounted) return;

      // Fallback seguro e risco zero de type instantiation deep/infinite
      if (error || !Array.isArray(data)) {
        setIndicators([]);
      } else {
        setIndicators(
          (data as any[]).map((item: any) => ({
            id: String(item.id),
            name: String(item.name),
          }))
        );
      }
      setLoading(false);
    }

    fetchIndicators();
    return () => {
      isMounted = false;
    };
  }, [company_id]);

  return { indicators, loading };
}
