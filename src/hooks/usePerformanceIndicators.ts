import { useState, useEffect } from "react";

// Simple type for safety and to avoid deep TS inference
export type PerformanceIndicator = {
  id: string;
  name: string;
};

export function usePerformanceIndicators(company_id?: string) {
  const [indicators, setIndicators] = useState<PerformanceIndicator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!company_id) {
      setIndicators([]);
      return;
    }
    
    // For now, return empty array since performance_indicators table 
    // doesn't have company_id column
    setLoading(true);
    
    // Simulate loading and return empty for now
    setTimeout(() => {
      setIndicators([]);
      setLoading(false);
    }, 100);
    
  }, [company_id]);

  return { indicators, loading };
}