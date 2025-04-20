
import { supabase } from "@/integrations/supabase/client";
import { IndicatorType } from "@/types/indicators";

export async function addIndicator(indicator: Omit<IndicatorType, "id" | "created_at" | "updated_at">): Promise<IndicatorType> {
  const { data, error } = await supabase
    .from("performance_indicators")
    .insert([indicator])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating indicator:", error);
    throw new Error(error.message);
  }
  
  return data;
}
