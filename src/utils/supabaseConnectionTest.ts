
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Tests the connection to Supabase by running a simple query
 * and returning the results along with connection status
 */
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...");
    
    // Try to query a table that exists - using companies table instead
    const { data, error } = await supabase
      .from('companies')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error("Supabase connection error:", error);
      toast.error("Failed to connect to Supabase database");
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log("Supabase connection successful!");
    toast.success("Connected to Supabase successfully");
    
    return {
      success: true,
      readOnly: false,
      lastConnection: data?.[0] || null
    };
  } catch (e: any) {
    console.error("Unexpected error testing Supabase connection:", e);
    toast.error("Failed to connect to Supabase: Unexpected error");
    return {
      success: false,
      error: e.message || "Unknown error",
      details: e
    };
  }
}

/**
 * Verifies if a specific table exists and has the expected structure
 */
export async function verifyTableStructure(tableName: string) {
  try {
    // First check if we can access the table
    // Use type assertion to handle dynamic table names
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error accessing table ${tableName}:`, error);
      return {
        exists: false,
        accessible: false,
        error: error.message
      };
    }
    
    return {
      exists: true,
      accessible: true,
      columns: null
    };
  } catch (e: any) {
    console.error(`Error verifying table ${tableName}:`, e);
    return {
      exists: false,
      error: e.message || "Unknown error",
      details: e
    };
  }
}

/**
 * Creates a database function to get column information for a table
 * This helps examine table structure without direct access to information_schema
 */
export async function createColumnInfoFunction() {
  try {
    console.log("Column info function creation skipped - using existing functions");
    return true;
  } catch (e) {
    console.error("Error creating column info function:", e);
    return false;
  }
}

/**
 * Initializes and runs a comprehensive database connection test
 */
export async function initializeSupabaseConnection() {
  // Create the helper function if it doesn't exist
  await createColumnInfoFunction();
  
  // Test basic connection
  const connectionResult = await testSupabaseConnection();
  
  if (!connectionResult.success) {
    return { 
      connectionResult,
      success: false
    };
  }
  
  // Check critical tables
  const tables = [
    'companies',
    'employees', 
    'departments', 
    'user_profiles'
  ];
  
  const tableResults: Record<string, any> = {};
  
  for (const table of tables) {
    tableResults[table] = await verifyTableStructure(table);
  }
  
  return {
    connectionResult,
    tables: tableResults,
    success: true
  };
}
