
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Simples type for safety and to avoid deep TS inference
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
      // Interpolação direta de company_id na query
      const sql = `
        select id::text, name::text
        from performance_indicators
        where company_id = '${company_id}'
      `;
      const { data, error } = await supabase.rpc("execute_sql_with_schema", {
        sql_statement: sql,
        target_schema: "public"
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
