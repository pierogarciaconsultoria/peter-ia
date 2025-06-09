
import { supabase } from "@/integrations/supabase/client";

export interface NonConformingProduct {
  id: string;
  product_name: string;
  description: string;
  status: 'identified' | 'in_progress' | 'resolved' | 'approved' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  requirement_id: string;
  department: string;
  customer?: string;
  non_conformity_type: string;
  immediate_action: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// NOTA: Estas funções estão desabilitadas porque a tabela 'non_conforming_products' não existe no banco atual
// Para usar este serviço, primeiro crie a tabela no banco de dados

export async function getNonConformingProducts(): Promise<NonConformingProduct[]> {
  console.warn("Tabela 'non_conforming_products' não existe no banco de dados atual");
  return [];
}

export async function getNonConformingProductById(id: string): Promise<NonConformingProduct | null> {
  console.warn("Tabela 'non_conforming_products' não existe no banco de dados atual");
  return null;
}

export async function createNonConformingProduct(product: Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>): Promise<NonConformingProduct | null> {
  console.warn("Tabela 'non_conforming_products' não existe no banco de dados atual");
  return null;
}

export async function updateNonConformingProduct(id: string, product: Partial<Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<NonConformingProduct | null> {
  console.warn("Tabela 'non_conforming_products' não existe no banco de dados atual");
  return null;
}

export async function deleteNonConformingProduct(id: string): Promise<void> {
  console.warn("Tabela 'non_conforming_products' não existe no banco de dados atual");
}
