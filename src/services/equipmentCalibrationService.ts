
import { supabase } from "@/integrations/supabase/client";

export interface EquipmentCalibration {
  id: string;
  equipment_name: string;
  equipment_id: string;
  calibration_date: string;
  next_calibration_date: string;
  responsible: string;
  status: 'valid' | 'expired' | 'scheduled';
  certificate_number?: string;
  calibration_entity: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export async function getEquipmentCalibrations(): Promise<EquipmentCalibration[]> {
  const { data, error } = await supabase
    .from('equipment_calibrations')
    .select('*')
    .order('next_calibration_date', { ascending: true });
  
  if (error) {
    console.error("Error fetching equipment calibrations:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as EquipmentCalibration['status'],
  }));
}

export async function getEquipmentCalibrationById(id: string): Promise<EquipmentCalibration> {
  const { data, error } = await supabase
    .from('equipment_calibrations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching equipment calibration:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as EquipmentCalibration['status'],
  };
}

export async function createEquipmentCalibration(calibration: Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentCalibration> {
  const { data, error } = await supabase
    .from('equipment_calibrations')
    .insert([calibration])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating equipment calibration:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as EquipmentCalibration['status'],
  };
}

export async function updateEquipmentCalibration(id: string, calibration: Partial<Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>>): Promise<EquipmentCalibration> {
  const { data, error } = await supabase
    .from('equipment_calibrations')
    .update({
      ...calibration,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating equipment calibration:", error);
    throw new Error(error.message);
  }
  
  return {
    ...data,
    status: data.status as EquipmentCalibration['status'],
  };
}

export async function deleteEquipmentCalibration(id: string): Promise<void> {
  const { error } = await supabase
    .from('equipment_calibrations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting equipment calibration:", error);
    throw new Error(error.message);
  }
}
