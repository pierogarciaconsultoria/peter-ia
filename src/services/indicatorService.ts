
import { supabase } from "@/integrations/supabase/client";
import { IndicatorType, MeasurementType } from "@/types/indicators";

// Indicators

export async function getAllIndicators(): Promise<IndicatorType[]> {
  const { data, error } = await supabase
    .from("performance_indicators")
    .select("*")
    .order("name");
  
  if (error) {
    console.error("Error fetching indicators:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function getIndicatorById(id: string): Promise<IndicatorType> {
  const { data, error } = await supabase
    .from("performance_indicators")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching indicator:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createIndicator(indicator: Omit<IndicatorType, "id" | "created_at" | "updated_at">): Promise<IndicatorType> {
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

export async function updateIndicator(
  id: string, 
  indicator: Omit<IndicatorType, "id" | "created_at" | "updated_at">
): Promise<IndicatorType> {
  const { data, error } = await supabase
    .from("performance_indicators")
    .update({
      ...indicator,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating indicator:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteIndicator(id: string): Promise<void> {
  const { error } = await supabase
    .from("performance_indicators")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting indicator:", error);
    throw new Error(error.message);
  }
}

// Measurements

export async function getAllMeasurements(): Promise<MeasurementType[]> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });
  
  if (error) {
    console.error("Error fetching measurements:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function getMeasurementsByIndicator(indicatorId: string): Promise<MeasurementType[]> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .select("*")
    .eq("indicator_id", indicatorId)
    .order("year", { ascending: false })
    .order("month", { ascending: false });
  
  if (error) {
    console.error("Error fetching measurements:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function getMeasurementById(id: string): Promise<MeasurementType> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching measurement:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createMeasurement(
  measurement: Omit<MeasurementType, "id" | "created_at" | "updated_at">
): Promise<MeasurementType> {
  // Check if a measurement for this indicator/month/year already exists
  const { data: existingData } = await supabase
    .from("indicator_measurements")
    .select("id")
    .eq("indicator_id", measurement.indicator_id)
    .eq("month", measurement.month)
    .eq("year", measurement.year)
    .maybeSingle();
  
  // If it exists, update instead of creating
  if (existingData) {
    return updateMeasurement(existingData.id, measurement);
  }
  
  const { data, error } = await supabase
    .from("indicator_measurements")
    .insert([measurement])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating measurement:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateMeasurement(
  id: string, 
  measurement: Omit<MeasurementType, "id" | "created_at" | "updated_at">
): Promise<MeasurementType> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .update({
      ...measurement,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating measurement:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteMeasurement(id: string): Promise<void> {
  const { error } = await supabase
    .from("indicator_measurements")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting measurement:", error);
    throw new Error(error.message);
  }
}
