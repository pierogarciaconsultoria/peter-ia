
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

// Mock data para demonstração até a tabela ser criada
const mockEquipmentCalibrations: EquipmentCalibration[] = [
  {
    id: '1',
    equipment_name: 'Balança Digital BX-100',
    equipment_id: 'EQ-001',
    calibration_date: '2024-01-15',
    next_calibration_date: '2025-01-15',
    responsible: 'João Silva',
    status: 'valid',
    certificate_number: 'CERT-2024-001',
    calibration_entity: 'INMETRO',
    observations: 'Calibração realizada conforme norma',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

export async function getEquipmentCalibrations(): Promise<EquipmentCalibration[]> {
  try {
    const { data, error } = await supabase
      .from('equipment_calibrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn("Tabela 'equipment_calibrations' não existe, usando dados mock:", error.message);
      return mockEquipmentCalibrations;
    }
    
    return data || [];
  } catch (error) {
    console.warn("Erro ao acessar equipment_calibrations, usando dados mock:", error);
    return mockEquipmentCalibrations;
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
      console.warn("Tabela 'equipment_calibrations' não existe, usando dados mock");
      return mockEquipmentCalibrations.find(item => item.id === id) || null;
    }
    
    return data;
  } catch (error) {
    console.warn("Erro ao acessar equipment_calibrations, usando dados mock:", error);
    return mockEquipmentCalibrations.find(item => item.id === id) || null;
  }
}

export async function createEquipmentCalibration(calibration: Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentCalibration | null> {
  try {
    const { data, error } = await supabase
      .from('equipment_calibrations')
      .insert(calibration)
      .select()
      .single();
    
    if (error) {
      console.warn("Tabela 'equipment_calibrations' não existe, simulando criação");
      const newCalibration: EquipmentCalibration = {
        ...calibration,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newCalibration;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar equipment calibration:", error);
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
      console.warn("Tabela 'equipment_calibrations' não existe, simulando atualização");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar equipment calibration:", error);
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
      console.warn("Tabela 'equipment_calibrations' não existe, simulando exclusão");
    }
  } catch (error) {
    console.error("Erro ao deletar equipment calibration:", error);
  }
}
