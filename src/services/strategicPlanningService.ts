
import { supabase } from "@/integrations/supabase/client";
import { 
  StrategicIdentity, 
  SwotItem, 
  BscPerspective, 
  BscObjective, 
  BscMeasure, 
  BusinessModelCanvas 
} from "@/types/strategic-planning";

// Strategic Identity Services
export async function getStrategicIdentity(): Promise<StrategicIdentity | null> {
  const { data, error } = await supabase
    .from('strategic_identity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    console.error("Error fetching strategic identity:", error);
    return null;
  }
  
  return data as StrategicIdentity;
}

export async function updateStrategicIdentity(identity: Partial<StrategicIdentity>): Promise<StrategicIdentity | null> {
  const { data: existingIdentity } = await supabase
    .from('strategic_identity')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (existingIdentity) {
    // Update existing identity
    const { data, error } = await supabase
      .from('strategic_identity')
      .update({ ...identity, updated_at: new Date().toISOString() })
      .eq('id', existingIdentity.id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating strategic identity:", error);
      return null;
    }
    
    return data as StrategicIdentity;
  } else {
    // Create new identity
    const { data, error } = await supabase
      .from('strategic_identity')
      .insert([{ ...identity, values: identity.values || [] }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating strategic identity:", error);
      return null;
    }
    
    return data as StrategicIdentity;
  }
}

// SWOT Analysis Services
export async function getSwotItems(): Promise<SwotItem[]> {
  const { data, error } = await supabase
    .from('swot_items')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching SWOT items:", error);
    return [];
  }
  
  return data as SwotItem[];
}

export async function createSwotItem(item: Omit<SwotItem, 'id' | 'created_at' | 'updated_at'>): Promise<SwotItem | null> {
  const { data, error } = await supabase
    .from('swot_items')
    .insert([item])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating SWOT item:", error);
    return null;
  }
  
  return data as SwotItem;
}

export async function updateSwotItem(id: string, item: Partial<Omit<SwotItem, 'id' | 'created_at' | 'updated_at'>>): Promise<SwotItem | null> {
  const { data, error } = await supabase
    .from('swot_items')
    .update({ ...item, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating SWOT item:", error);
    return null;
  }
  
  return data as SwotItem;
}

export async function deleteSwotItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('swot_items')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting SWOT item:", error);
    return false;
  }
  
  return true;
}

// BSC Services
export async function getBscPerspectives(): Promise<BscPerspective[]> {
  const { data, error } = await supabase
    .from('bsc_perspectives')
    .select(`
      *,
      objectives:bsc_objectives(
        *,
        measures:bsc_measures(*)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching BSC perspectives:", error);
    return [];
  }
  
  return data as unknown as BscPerspective[];
}

export async function createBscObjective(objective: Omit<BscObjective, 'id' | 'created_at' | 'updated_at' | 'measures'>): Promise<BscObjective | null> {
  const { data, error } = await supabase
    .from('bsc_objectives')
    .insert([objective])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating BSC objective:", error);
    return null;
  }
  
  return { ...data, measures: [] } as BscObjective;
}

export async function createBscMeasure(measure: Omit<BscMeasure, 'id' | 'created_at' | 'updated_at'>): Promise<BscMeasure | null> {
  const { data, error } = await supabase
    .from('bsc_measures')
    .insert([measure])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating BSC measure:", error);
    return null;
  }
  
  return data as BscMeasure;
}

// Business Model Canvas Services
export async function getBusinessModelCanvas(): Promise<BusinessModelCanvas | null> {
  const { data, error } = await supabase
    .from('business_model_canvas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    console.error("Error fetching Business Model Canvas:", error);
    return null;
  }
  
  return data as BusinessModelCanvas;
}

export async function updateBusinessModelCanvas(canvas: Partial<BusinessModelCanvas>): Promise<BusinessModelCanvas | null> {
  const { data: existingCanvas } = await supabase
    .from('business_model_canvas')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (existingCanvas) {
    // Update existing canvas
    const { data, error } = await supabase
      .from('business_model_canvas')
      .update({ ...canvas, updated_at: new Date().toISOString() })
      .eq('id', existingCanvas.id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating Business Model Canvas:", error);
      return null;
    }
    
    return data as BusinessModelCanvas;
  } else {
    // Create new canvas
    const { data, error } = await supabase
      .from('business_model_canvas')
      .insert([canvas])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating Business Model Canvas:", error);
      return null;
    }
    
    return data as BusinessModelCanvas;
  }
}
