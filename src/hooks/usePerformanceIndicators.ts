
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
      // Don't use generics in from or select to prevent type recursion
      const { data, error } = await supabase
        .from("performance_indicators")
        .select("id, name")
        .eq("company_id", company_id);

      if (!isMounted) return;

      if (error || !data || !Array.isArray(data)) {
        setIndicators([]);
      } else {
        // Create plain objects to avoid deep type instantiation issues
        setIndicators(
          data.map((item: any) => ({
            id: item.id,
            name: item.name,
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
