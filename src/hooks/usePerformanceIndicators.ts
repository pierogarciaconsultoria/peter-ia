
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
    if (!company_id) return;
    setLoading(true);

    async function fetchIndicators() {
      try {
        // Explicitly type the Supabase response
        const { data } = await supabase
          .from("performance_indicators")
          .select("id, name")
          .eq("company_id", company_id);

        // Explicitly cast/handle returned data array
        setIndicators((data as PerformanceIndicator[]) || []);
      } finally {
        setLoading(false);
      }
    }

    fetchIndicators();
  }, [company_id]);

  return { indicators, loading };
}
