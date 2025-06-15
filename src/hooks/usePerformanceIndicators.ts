
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Use tipo explícito para evitar inferência complexa
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
      const { data, error } = await supabase
        .from<PerformanceIndicator>("performance_indicators")
        .select("id, name")
        .eq("company_id", company_id);

      if (!isMounted) return;
      setIndicators((data as PerformanceIndicator[]) || []);
      setLoading(false);
    }

    fetchIndicators();
    return () => { isMounted = false; };
  }, [company_id]);

  return { indicators, loading };
}
