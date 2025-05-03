
import { supabase } from "@/integrations/supabase/client";
import { TaskManager } from "@/types/tasks";

/**
 * Gets all managers for a specific module
 */
export const getModuleManagers = async (module: string): Promise<TaskManager[]> => {
  try {
    // Validar o parâmetro de entrada
    if (!module || typeof module !== 'string') {
      console.warn('Invalid module provided to getModuleManagers:', module);
      return [];
    }
    
    // Query the database directly
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'manager')
      .contains('allowed_modules', [module]); // Using contains operator for array check
    
    if (error) {
      console.error('Error fetching module managers:', error.message);
      return [];
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No manager data found for module:', module);
      return [];
    }
    
    // Safely transform data with proper type checking
    return data
      .filter(item => item && typeof item === 'object' && 'id' in item && item.id && typeof item.id === 'string')
      .map(item => ({ id: String(item.id) }));
  } catch (err) {
    console.error('Exception when fetching module managers:', err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};
