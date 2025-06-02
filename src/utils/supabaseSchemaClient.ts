
import { supabase } from '@/integrations/supabase/client';
import { schemaContext } from './schemaContext';
import { logger } from './logger';

export class SupabaseSchemaClient {
  private static instance: SupabaseSchemaClient;
  
  public static getInstance(): SupabaseSchemaClient {
    if (!SupabaseSchemaClient.instance) {
      SupabaseSchemaClient.instance = new SupabaseSchemaClient();
    }
    return SupabaseSchemaClient.instance;
  }

  // Método principal para criar queries com contexto de schema
  from(tableName: string) {
    const contextualTableName = schemaContext.getTableName(tableName);
    const currentSchema = schemaContext.getCurrentSchema();
    
    logger.debug('SupabaseSchemaClient', 'Query criada', {
      originalTable: tableName,
      contextualTable: contextualTableName,
      schema: currentSchema,
      context: schemaContext.getCurrentContext().id
    });

    // Se a tabela já tem o schema prefixado, usar diretamente
    if (contextualTableName.includes('.')) {
      return supabase.from(contextualTableName);
    }
    
    // Se não é o schema padrão, adicionar o prefixo
    if (currentSchema !== 'public') {
      return supabase.from(`${currentSchema}.${contextualTableName}`);
    }
    
    return supabase.from(contextualTableName);
  }

  // Método para executar RPC com contexto
  rpc(functionName: string, params?: any) {
    const currentSchema = schemaContext.getCurrentSchema();
    
    // Se não é o schema padrão, verificar se existe versão específica da função
    if (currentSchema !== 'public') {
      // Por enquanto, usar as funções do public schema
      // No futuro, podemos criar versões específicas das funções
      logger.debug('SupabaseSchemaClient', 'RPC chamada', {
        function: functionName,
        schema: currentSchema,
        params
      });
    }
    
    return supabase.rpc(functionName, params);
  }

  // Método para executar queries SQL diretas com contexto
  async executeQuery(query: string, params?: any[]) {
    const currentSchema = schemaContext.getCurrentSchema();
    
    // Adicionar SET search_path se não for o schema padrão
    let contextualQuery = query;
    if (currentSchema !== 'public') {
      contextualQuery = `SET search_path TO ${currentSchema}, public; ${query}`;
    }
    
    logger.debug('SupabaseSchemaClient', 'Query SQL executada', {
      originalQuery: query,
      contextualQuery,
      schema: currentSchema
    });
    
    return supabase.rpc('exec_sql', { sql_statement: contextualQuery });
  }

  // Getter para acesso direto ao cliente Supabase original (quando necessário)
  get client() {
    return supabase;
  }

  // Método para verificar se uma tabela existe no contexto atual
  async tableExists(tableName: string): Promise<boolean> {
    const contextualTableName = schemaContext.getTableName(tableName);
    const currentSchema = schemaContext.getCurrentSchema();
    
    try {
      const { data, error } = await supabase.rpc('check_table_exists', {
        table_name: contextualTableName.replace(`${currentSchema}.`, '')
      });
      
      if (error) {
        logger.error('SupabaseSchemaClient', 'Erro ao verificar tabela', error);
        return false;
      }
      
      return data?.table_exists || false;
    } catch (error) {
      logger.error('SupabaseSchemaClient', 'Erro inesperado ao verificar tabela', error);
      return false;
    }
  }

  // Método para mudar o contexto e validar
  async switchContext(projectId: string): Promise<boolean> {
    const success = schemaContext.setContext(projectId);
    if (!success) {
      return false;
    }

    // Validar se o schema existe e é acessível
    try {
      const currentSchema = schemaContext.getCurrentSchema();
      const { data, error } = await this.executeQuery(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${currentSchema}'`
      );
      
      if (error || !data) {
        logger.error('SupabaseSchemaClient', 'Schema não acessível', { schema: currentSchema, error });
        schemaContext.resetToDefault();
        return false;
      }
      
      // Salvar contexto no localStorage
      localStorage.setItem('project_context', projectId);
      
      logger.info('SupabaseSchemaClient', 'Contexto alterado com sucesso', {
        projectId,
        schema: currentSchema
      });
      
      return true;
    } catch (error) {
      logger.error('SupabaseSchemaClient', 'Erro ao validar contexto', error);
      schemaContext.resetToDefault();
      return false;
    }
  }
}

// Instância singleton
export const supabaseSchema = SupabaseSchemaClient.getInstance();

// Hook React para usar o cliente com contexto
export const useSupabaseSchema = () => {
  return {
    client: supabaseSchema,
    context: schemaContext.getCurrentContext(),
    switchContext: supabaseSchema.switchContext.bind(supabaseSchema),
    tableExists: supabaseSchema.tableExists.bind(supabaseSchema)
  };
};
