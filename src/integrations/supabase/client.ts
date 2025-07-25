
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuração segura - Usar valores fixos para Lovable AI
const SUPABASE_URL = "https://kxkcgbtsgfyisbrtjmvv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a2NnYnRzZ2Z5aXNicnRqbXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzODQ1MTQsImV4cCI6MjA1NDk2MDUxNH0.JHd7Cafdd4gxn7s_DE3ndeHiZ7Y-Om-c5M8J0POem0U";

// Validação básica de formato
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.includes('supabase.co') || url.includes('localhost');
  } catch {
    return false;
  }
};

const isValidKey = (key: string) => {
  return key && key.length > 10 && key.startsWith('eyJ');
};

// Verificar se as credenciais são válidas
if (!isValidUrl(SUPABASE_URL) || !isValidKey(SUPABASE_PUBLISHABLE_KEY)) {
  throw new Error('Invalid Supabase configuration. Please check your environment variables.');
}

// Log de configuração (apenas em desenvolvimento)
if (typeof window !== 'undefined') {
  console.log('Supabase client initialized:', {
    url: SUPABASE_URL.substring(0, 30) + '...',
    hasKey: !!SUPABASE_PUBLISHABLE_KEY
  });
}

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      flowType: 'pkce'
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'peter-ia'
      }
    }
  }
);

// Helper function to check if admin account exists
export const confirmAdminEmail = async (email: string) => {
  try {
    console.log("Checking admin account:", email);
    
    // Verificação segura sem bypass
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: new Error("User not authenticated") };
    }
    
    // Verificar se o usuário atual tem permissões de admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_super_admin, is_company_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return { success: false, error: new Error("Unable to verify admin status") };
    }
    
    if (!profile.is_super_admin && !profile.is_company_admin) {
      return { success: false, error: new Error("Insufficient permissions") };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Unexpected error checking admin account:", error);
    return { success: false, error };
  }
};

// Função para testar a conexão com tratamento de erro
export const testConnection = async () => {
  try {
    // Teste simples com uma tabela que existe
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    return { success: !error, error: error?.message || null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown connection error' };
  }
};

