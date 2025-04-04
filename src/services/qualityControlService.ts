
import { supabase } from "@/integrations/supabase/client";

// Quality Inspection Types
export interface QualityCriteriaResult {
  criteria_id?: string;
  criteria_name: string;
  expected_value: string;
  actual_value: string;
  is_conforming: boolean;
  observation?: string;
}

export interface QualityInspection {
  id: string;
  created_at: string;
  updated_at: string;
  inspection_date: string;
  product_name: string;
  batch_number: string;
  inspector: string;
  status: "approved" | "rejected" | "with_observations";
  inspection_type: "process" | "final";
  process_name?: string;
  criteria_results: QualityCriteriaResult[];
  observations?: string;
}

// Quality Criteria Types
export interface QualityCriteria {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  expected_value: string;
  tolerance?: string;
  measurement_unit?: string;
  category: string;
  company_segment: string;
  is_active: boolean;
}

// Mock data for development
const mockInspections: QualityInspection[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    inspection_date: new Date().toISOString(),
    product_name: "Smartphone X1",
    batch_number: "B2025-0401",
    inspector: "João Silva",
    status: "approved",
    inspection_type: "final",
    criteria_results: [
      {
        criteria_name: "Dimensões",
        expected_value: "145mm x 70mm x 8mm",
        actual_value: "145.2mm x 70.1mm x 8.0mm",
        is_conforming: true
      },
      {
        criteria_name: "Peso",
        expected_value: "180g",
        actual_value: "179g",
        is_conforming: true
      }
    ]
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    inspection_date: new Date(Date.now() - 86400000).toISOString(),
    product_name: "Notebook Pro",
    batch_number: "NB2025-213",
    inspector: "Maria Oliveira",
    status: "rejected",
    inspection_type: "final",
    criteria_results: [
      {
        criteria_name: "Teste de Bateria",
        expected_value: "Mínimo 6h",
        actual_value: "4.5h",
        is_conforming: false,
        observation: "Bateria abaixo da especificação"
      },
      {
        criteria_name: "Resolução de Tela",
        expected_value: "1920x1080",
        actual_value: "1920x1080",
        is_conforming: true
      }
    ],
    observations: "Problema identificado na célula de bateria, lote retido para análise"
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    inspection_date: new Date(Date.now() - 172800000).toISOString(),
    product_name: "Carregador USB-C",
    batch_number: "CH2025-109",
    inspector: "Carlos Mendes",
    status: "with_observations",
    inspection_type: "process",
    process_name: "Moldagem do Plástico",
    criteria_results: [
      {
        criteria_name: "Resistência Mecânica",
        expected_value: "Suporta 15kg",
        actual_value: "Suporta 14kg",
        is_conforming: true,
        observation: "Dentro da tolerância"
      },
      {
        criteria_name: "Acabamento Superficial",
        expected_value: "Sem rebarbas",
        actual_value: "Rebarbas mínimas",
        is_conforming: false,
        observation: "Necessita ajuste no molde"
      }
    ],
    observations: "Processo continua em operação com monitoramento adicional"
  }
];

const mockCriteria: QualityCriteria[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Dimensões",
    description: "Medidas físicas do produto",
    expected_value: "Conforme especificação",
    measurement_unit: "mm",
    category: "Física",
    company_segment: "Eletrônicos",
    is_active: true
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Peso",
    description: "Peso do produto",
    expected_value: "Conforme especificação",
    measurement_unit: "g",
    category: "Física",
    company_segment: "Eletrônicos",
    is_active: true
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Tensão de Saída",
    description: "Tensão elétrica fornecida",
    expected_value: "5V ± 0.2V",
    measurement_unit: "V",
    category: "Elétrica",
    company_segment: "Eletrônicos",
    is_active: true
  }
];

// Service functions
export async function getQualityInspections(): Promise<QualityInspection[]> {
  // In a real implementation, we would fetch from Supabase
  // const { data, error } = await supabase.from("quality_inspections").select("*");
  // if (error) throw error;
  // return data as QualityInspection[];
  
  // For now, return mock data
  return mockInspections;
}

export async function getQualityInspectionById(id: string): Promise<QualityInspection | null> {
  // const { data, error } = await supabase.from("quality_inspections").select("*").eq("id", id).single();
  // if (error) throw error;
  // return data as QualityInspection;
  
  const inspection = mockInspections.find(i => i.id === id);
  return inspection || null;
}

export async function createQualityInspection(inspection: Omit<QualityInspection, "id" | "created_at" | "updated_at">): Promise<QualityInspection> {
  // const { data, error } = await supabase.from("quality_inspections").insert([inspection]).select();
  // if (error) throw error;
  // return data[0] as QualityInspection;
  
  const newInspection: QualityInspection = {
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...inspection
  };
  
  mockInspections.push(newInspection);
  return newInspection;
}

export async function updateQualityInspection(id: string, updates: Partial<QualityInspection>): Promise<QualityInspection | null> {
  // const { data, error } = await supabase.from("quality_inspections").update(updates).eq("id", id).select();
  // if (error) throw error;
  // return data[0] as QualityInspection;
  
  const index = mockInspections.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  mockInspections[index] = {
    ...mockInspections[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockInspections[index];
}

export async function deleteQualityInspection(id: string): Promise<void> {
  // const { error } = await supabase.from("quality_inspections").delete().eq("id", id);
  // if (error) throw error;
  
  const index = mockInspections.findIndex(i => i.id === id);
  if (index !== -1) {
    mockInspections.splice(index, 1);
  }
}

// Quality Criteria functions
export async function getQualityCriteria(): Promise<QualityCriteria[]> {
  // const { data, error } = await supabase.from("quality_criteria").select("*");
  // if (error) throw error;
  // return data as QualityCriteria[];
  
  return mockCriteria;
}

export async function getQualityCriteriaById(id: string): Promise<QualityCriteria | null> {
  // const { data, error } = await supabase.from("quality_criteria").select("*").eq("id", id).single();
  // if (error) throw error;
  // return data as QualityCriteria;
  
  const criteria = mockCriteria.find(c => c.id === id);
  return criteria || null;
}

export async function createQualityCriteria(criteria: Omit<QualityCriteria, "id" | "created_at" | "updated_at">): Promise<QualityCriteria> {
  // const { data, error } = await supabase.from("quality_criteria").insert([criteria]).select();
  // if (error) throw error;
  // return data[0] as QualityCriteria;
  
  const newCriteria: QualityCriteria = {
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...criteria
  };
  
  mockCriteria.push(newCriteria);
  return newCriteria;
}

export async function updateQualityCriteria(id: string, updates: Partial<QualityCriteria>): Promise<QualityCriteria | null> {
  // const { data, error } = await supabase.from("quality_criteria").update(updates).eq("id", id).select();
  // if (error) throw error;
  // return data[0] as QualityCriteria;
  
  const index = mockCriteria.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  mockCriteria[index] = {
    ...mockCriteria[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockCriteria[index];
}

export async function deleteQualityCriteria(id: string): Promise<void> {
  // const { error } = await supabase.from("quality_criteria").delete().eq("id", id);
  // if (error) throw error;
  
  const index = mockCriteria.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCriteria.splice(index, 1);
  }
}

// Create new tables in Supabase later when needed
// Example SQL to create these tables:
/*
CREATE TABLE quality_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  inspection_date TIMESTAMP WITH TIME ZONE NOT NULL,
  product_name TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  inspector TEXT NOT NULL,
  status TEXT NOT NULL,
  inspection_type TEXT NOT NULL,
  process_name TEXT,
  criteria_results JSONB NOT NULL,
  observations TEXT
);

CREATE TABLE quality_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  expected_value TEXT NOT NULL,
  tolerance TEXT,
  measurement_unit TEXT,
  category TEXT NOT NULL,
  company_segment TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);
*/
