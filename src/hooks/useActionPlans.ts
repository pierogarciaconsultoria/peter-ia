
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ActionPlan = {
  id: string;
  title: string;
};

export function useActionPlans(company_id?: string) {
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!company_id) return;
    setLoading(true);
    supabase
      .from("action_plans")
      .select("id, title")
      .eq("company_id", company_id)
      .then(({ data }) => setActionPlans(data || []))
      .finally(() => setLoading(false));
  }, [company_id]);

  return { actionPlans, loading };
}
