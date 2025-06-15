
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
    supabase
      .from("performance_indicators")
      .select("id, name")
      .eq("company_id", company_id)
      .then(({ data }) => setIndicators(data || []))
      .finally(() => setLoading(false));
  }, [company_id]);

  return { indicators, loading };
}
