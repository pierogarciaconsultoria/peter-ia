
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
      // Do NOT use generics on .from or .select to prevent recursion issues!
      const { data, error } = await supabase
        .from("performance_indicators")
        .select("id, name")
        .eq("company_id", company_id);

      if (!isMounted) return;
      if (error || !data) {
        setIndicators([]);
      } else {
        // Do type assertion only here
        setIndicators(data as PerformanceIndicator[]);
      }
      setLoading(false);
    }

    fetchIndicators();
    return () => { isMounted = false; };
  }, [company_id]);

  return { indicators, loading };
}
