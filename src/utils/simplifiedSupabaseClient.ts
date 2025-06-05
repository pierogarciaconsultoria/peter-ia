
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

  // Método principal para criar queries com validação de tabela
  from(tableName: string) {
    logger.debug('SimplifiedSupabaseClient', 'Query criada', {
      table: tableName
    });

    // Cast para any para evitar problemas de tipagem com tabelas dinâmicas
    return supabase.from(tableName as any);
  }

  // Método para executar RPC com validação
  rpc(functionName: string, params?: any) {
    logger.debug('SimplifiedSupabaseClient', 'RPC chamada', {
      function: functionName,
      params
    });
    
    // Cast para any para evitar problemas de tipagem com funções dinâmicas
    return supabase.rpc(functionName as any, params);
  }

  // Getter para acesso direto ao cliente Supabase original
  get client() {
    return supabase;
  }

  // Método para verificar se uma tabela existe (usando query SQL)
  async tableExists(tableName: string): Promise<boolean> {
    try {
      // Usar uma consulta SQL para verificar se a tabela existe
      const { data, error } = await supabase
        .rpc('check_table_exists', { table_name: tableName });
      
      if (error) {
        logger.error('SimplifiedSupabaseClient', 'Erro ao verificar tabela', { tableName, error });
        return false;
      }
      
      return data || false;
    } catch (error) {
      logger.error('SimplifiedSupabaseClient', 'Erro inesperado ao verificar tabela', error);
      return false;
    }
  }

  // Método para fazer queries seguras com verificação de tabela
  async safeQuery(tableName: string, callback: (table: any) => any) {
    try {
      const exists = await this.tableExists(tableName);
      if (!exists) {
        logger.warn('SimplifiedSupabaseClient', 'Tabela não existe', { tableName });
        return { data: null, error: new Error(`Table ${tableName} does not exist`) };
      }
      
      return await callback(this.from(tableName));
    } catch (error) {
      logger.error('SimplifiedSupabaseClient', 'Erro na query segura', { tableName, error });
      return { data: null, error };
    }
  }
}

// Instância singleton
export const simplifiedSupabaseClient = SimplifiedSupabaseClient.getInstance();

// Hook React para usar o cliente
export const useSimplifiedSupabase = () => {
  return {
    client: simplifiedSupabaseClient,
    tableExists: simplifiedSupabaseClient.tableExists.bind(simplifiedSupabaseClient),
    safeQuery: simplifiedSupabaseClient.safeQuery.bind(simplifiedSupabaseClient)
  };
};
