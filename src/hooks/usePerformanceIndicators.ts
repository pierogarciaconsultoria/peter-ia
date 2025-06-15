
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Tipo explícito do indicador
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
      // Cast response to any[] IMMEDIATELY to avoid TS inference issues
      const { data, error } = await supabase
        .from("performance_indicators")
        .select("id, name")
        .eq("company_id", company_id);

      if (!isMounted) return;

      const rows = data as any[] | null | undefined;
      if (error || !Array.isArray(rows)) {
        setIndicators([]);
      } else {
        // Map only top-level fields to string for safety
        setIndicators(
          rows.map((item) => ({
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
