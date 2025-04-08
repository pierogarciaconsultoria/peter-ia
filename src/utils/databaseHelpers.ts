
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a database function to retrieve column information for tables
 */
export async function setupDatabaseHelpers() {
  try {
    // Create a function to get table columns information
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
        RETURNS TABLE (
          column_name text,
          data_type text,
          is_nullable boolean,
          column_default text
        )
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY
          SELECT 
            c.column_name::text,
            c.data_type::text,
            (c.is_nullable = 'YES')::boolean,
            c.column_default::text
          FROM information_schema.columns c
          WHERE c.table_schema = 'public'
            AND c.table_name = table_name
          ORDER BY c.ordinal_position;
        END;
        $$;
        
        CREATE OR REPLACE FUNCTION public.create_column_info_function()
        RETURNS boolean
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Function already exists if this function is running
          RETURN true;
        END;
        $$;
      `
    });

    if (error) {
      console.error("Error setting up database helper functions:", error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Error in setupDatabaseHelpers:", e);
    return false;
  }
}

/**
 * Executes custom SQL query (for admin use only)
 */
export async function executeQuery(sql: string) {
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: sql
    });
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e };
  }
}
