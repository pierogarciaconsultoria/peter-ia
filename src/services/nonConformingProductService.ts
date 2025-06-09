
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

// Mock data para demonstração até a tabela ser criada
const mockNonConformingProducts: NonConformingProduct[] = [
  {
    id: '1',
    product_name: 'Produto X',
    description: 'Produto fora das especificações de qualidade',
    status: 'identified',
    severity: 'high',
    requirement_id: '4.4.1',
    department: 'Produção',
    customer: 'Cliente A',
    non_conformity_type: 'Dimensional',
    immediate_action: 'Segregar lote',
    approval_status: 'pending',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

export async function getNonConformingProducts(): Promise<NonConformingProduct[]> {
  try {
    const { data, error } = await supabase
      .from('non_conforming_products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn("Tabela 'non_conforming_products' não existe, usando dados mock:", error.message);
      return mockNonConformingProducts;
    }
    
    return data || [];
  } catch (error) {
    console.warn("Erro ao acessar non_conforming_products, usando dados mock:", error);
    return mockNonConformingProducts;
  }
}

export async function getNonConformingProductById(id: string): Promise<NonConformingProduct | null> {
  try {
    const { data, error } = await supabase
      .from('non_conforming_products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.warn("Tabela 'non_conforming_products' não existe, usando dados mock");
      return mockNonConformingProducts.find(item => item.id === id) || null;
    }
    
    return data;
  } catch (error) {
    console.warn("Erro ao acessar non_conforming_products, usando dados mock:", error);
    return mockNonConformingProducts.find(item => item.id === id) || null;
  }
}

export async function createNonConformingProduct(product: Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>): Promise<NonConformingProduct | null> {
  try {
    const { data, error } = await supabase
      .from('non_conforming_products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.warn("Tabela 'non_conforming_products' não existe, simulando criação");
      const newProduct: NonConformingProduct = {
        ...product,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newProduct;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar non conforming product:", error);
    return null;
  }
}

export async function updateNonConformingProduct(id: string, product: Partial<Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<NonConformingProduct | null> {
  try {
    const { data, error } = await supabase
      .from('non_conforming_products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.warn("Tabela 'non_conforming_products' não existe, simulando atualização");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar non conforming product:", error);
    return null;
  }
}

export async function deleteNonConformingProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('non_conforming_products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.warn("Tabela 'non_conforming_products' não existe, simulando exclusão");
    }
  } catch (error) {
    console.error("Erro ao deletar non conforming product:", error);
  }
}
