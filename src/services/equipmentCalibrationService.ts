
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
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export async function getEquipmentCalibrations(): Promise<EquipmentCalibration[]> {
  try {
    const { data, error } = await supabase
      .from('equipment_calibrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar calibrações de equipamentos:", error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro inesperado ao buscar equipment_calibrations:", error);
    return [];
  }
}

export async function getEquipmentCalibrationById(id: string): Promise<EquipmentCalibration | null> {
  try {
    const { data, error } = await supabase
      .from('equipment_calibrations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Erro ao buscar calibração por ID:", error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro inesperado ao buscar equipment calibration por ID:", error);
    return null;
  }
}

export async function createEquipmentCalibration(calibration: Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentCalibration | null> {
  try {
    // Get user's company ID
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('id', userData.user.id)
      .single();

    if (!profileData?.company_id) {
      throw new Error("Empresa do usuário não encontrada");
    }

    const { data, error } = await supabase
      .from('equipment_calibrations')
      .insert({
        ...calibration,
        company_id: profileData.company_id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar equipment calibration:", error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro inesperado ao criar equipment calibration:", error);
    return null;
  }
}

export async function updateEquipmentCalibration(id: string, calibration: Partial<Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>>): Promise<EquipmentCalibration | null> {
  try {
    const { data, error } = await supabase
      .from('equipment_calibrations')
      .update(calibration)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao atualizar equipment calibration:", error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro inesperado ao atualizar equipment calibration:", error);
    return null;
  }
}

export async function deleteEquipmentCalibration(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('equipment_calibrations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao deletar equipment calibration:", error.message);
    }
  } catch (error) {
    console.error("Erro inesperado ao deletar equipment calibration:", error);
  }
}
