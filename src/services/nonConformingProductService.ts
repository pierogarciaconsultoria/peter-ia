
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
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export async function getNonConformingProducts(): Promise<NonConformingProduct[]> {
  try {
    const { data, error } = await supabase
      .from('non_conforming_products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar produtos não conformes:", error.message);
      return [];
    }
    
    return (data || []) as NonConformingProduct[];
  } catch (error) {
    console.error("Erro inesperado ao buscar non_conforming_products:", error);
    return [];
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
      console.error("Erro ao buscar produto não conforme por ID:", error.message);
      return null;
    }
    
    return data as NonConformingProduct;
  } catch (error) {
    console.error("Erro inesperado ao buscar non conforming product por ID:", error);
    return null;
  }
}

export async function createNonConformingProduct(product: Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>): Promise<NonConformingProduct | null> {
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
      .from('non_conforming_products')
      .insert({
        ...product,
        company_id: profileData.company_id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar non conforming product:", error.message);
      return null;
    }
    
    return data as NonConformingProduct;
  } catch (error) {
    console.error("Erro inesperado ao criar non conforming product:", error);
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
      console.error("Erro ao atualizar non conforming product:", error.message);
      return null;
    }
    
    return data as NonConformingProduct;
  } catch (error) {
    console.error("Erro inesperado ao atualizar non conforming product:", error);
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
      console.error("Erro ao deletar non conforming product:", error.message);
    }
  } catch (error) {
    console.error("Erro inesperado ao deletar non conforming product:", error);
  }
}
