
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Tests the connection to Supabase by running a simple query
 * and returning the results along with connection status
 */
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...");
    
    // Try to query the connection_test table
    const { data, error } = await supabase
      .from('connection_test')
      .select('*')
      .order('connection_time', { ascending: false })
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
    
    // Record a new connection test entry
    const { error: insertError } = await supabase
      .from('connection_test')
      .insert([
        { message: `Connection test at ${new Date().toISOString()}` }
      ]);
    
    if (insertError) {
      console.warn("Could read but not write to Supabase:", insertError);
      return {
        success: true,
        readOnly: true,
        lastConnection: data?.[0] || null,
        error: insertError.message
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
    const { data, error } = await supabase
      .from(tableName)
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
    
    // Get table structure info from postgres
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: tableName });
    
    if (columnsError) {
      console.warn(`Could not retrieve column info for ${tableName}:`, columnsError);
      return {
        exists: true,
        accessible: true,
        columns: null,
        error: columnsError.message
      };
    }
    
    return {
      exists: true,
      accessible: true,
      columns: columns
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
    const { error } = await supabase.rpc('create_column_info_function');
    if (error) {
      console.error("Could not create column info function:", error);
      return false;
    }
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
    return connectionResult;
  }
  
  // Check critical tables
  const tables = [
    'job_positions', 
    'employees', 
    'departments', 
    'occurrences',
    'customer_complaints'
  ];
  
  const tableResults = {};
  
  for (const table of tables) {
    tableResults[table] = await verifyTableStructure(table);
  }
  
  return {
    connection: connectionResult,
    tables: tableResults
  };
}
