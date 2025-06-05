
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

export class SimplifiedSupabaseClient {
  private static instance: SimplifiedSupabaseClient;
  
  public static getInstance(): SimplifiedSupabaseClient {
    if (!SimplifiedSupabaseClient.instance) {
      SimplifiedSupabaseClient.instance = new SimplifiedSupabaseClient();
    }
    return SimplifiedSupabaseClient.instance;
  }

  // Método principal para criar queries
  from(tableName: string) {
    logger.debug('SimplifiedSupabaseClient', 'Query criada', {
      table: tableName
    });

    return supabase.from(tableName);
  }

  // Método para executar RPC
  rpc(functionName: string, params?: any) {
    logger.debug('SimplifiedSupabaseClient', 'RPC chamada', {
      function: functionName,
      params
    });
    
    return supabase.rpc(functionName, params);
  }

  // Getter para acesso direto ao cliente Supabase original
  get client() {
    return supabase;
  }

  // Método para verificar se uma tabela existe
  async tableExists(tableName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(1);
      
      if (error) {
        logger.error('SimplifiedSupabaseClient', 'Erro ao verificar tabela', { tableName, error });
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('SimplifiedSupabaseClient', 'Erro inesperado ao verificar tabela', error);
      return false;
    }
  }
}

// Instância singleton
export const simplifiedSupabaseClient = SimplifiedSupabaseClient.getInstance();

// Hook React para usar o cliente
export const useSimplifiedSupabase = () => {
  return {
    client: simplifiedSupabaseClient,
    tableExists: simplifiedSupabaseClient.tableExists.bind(simplifiedSupabaseClient)
  };
};
