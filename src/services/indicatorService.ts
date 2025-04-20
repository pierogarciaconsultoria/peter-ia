
import { supabase } from "@/integrations/supabase/client";
import { IndicatorType, MeasurementType } from "@/types/indicators";

// Get all indicators
export async function getAllIndicators(): Promise<IndicatorType[]> {
  const { data, error } = await supabase
    .from("performance_indicators")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching indicators:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Get measurements for an indicator
export async function getMeasurementsByIndicator(indicatorId: string): Promise<MeasurementType[]> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .select("*")
    .eq("indicator_id", indicatorId)
    .order("year", { ascending: true })
    .order("month", { ascending: true });
    
  if (error) {
    console.error("Error fetching measurements:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Get all measurements
export async function getAllMeasurements(): Promise<MeasurementType[]> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .select("*")
    .order("year", { ascending: true })
    .order("month", { ascending: true });
    
  if (error) {
    console.error("Error fetching measurements:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Add a new indicator
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
  
  return data as IndicatorType;
}

// Create an indicator (alias for addIndicator for compatibility)
export const createIndicator = addIndicator;

// Update an indicator
export async function updateIndicator(id: string, indicator: Partial<IndicatorType>): Promise<IndicatorType> {
  const { data, error } = await supabase
    .from("performance_indicators")
    .update(indicator)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating indicator:", error);
    throw new Error(error.message);
  }
  
  return data as IndicatorType;
}

// Delete an indicator
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

// Create a measurement
export async function createMeasurement(measurement: Omit<MeasurementType, "id" | "created_at" | "updated_at">): Promise<MeasurementType> {
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

// Update a measurement
export async function updateMeasurement(id: string, measurement: Partial<MeasurementType>): Promise<MeasurementType> {
  const { data, error } = await supabase
    .from("indicator_measurements")
    .update(measurement)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating measurement:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Delete a measurement
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
