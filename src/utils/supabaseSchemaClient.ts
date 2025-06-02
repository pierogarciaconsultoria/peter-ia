
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
      return (supabase as any).from(contextualTableName);
    }
    
    // Se não é o schema padrão, adicionar o prefixo
    if (currentSchema !== 'public') {
      return (supabase as any).from(`${currentSchema}.${contextualTableName}`);
    }
    
    return (supabase as any).from(contextualTableName);
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
    
    return (supabase as any).rpc(functionName, params);
  }

  // Método para executar queries SQL diretas com contexto
  async executeQuery(query: string, params?: any[]) {
    const currentSchema = schemaContext.getCurrentSchema();
    
    // Usar a nova função execute_sql_with_schema
    try {
      const { data, error } = await supabase.rpc('execute_sql_with_schema', {
        sql_statement: query,
        target_schema: currentSchema
      });
      
      if (error) throw error;
      
      logger.debug('SupabaseSchemaClient', 'Query SQL executada', {
        originalQuery: query,
        schema: currentSchema
      });
      
      return { data, error: null };
    } catch (error) {
      logger.error('SupabaseSchemaClient', 'Erro ao executar query', error);
      return { data: null, error };
    }
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
      const { data, error } = await supabase.rpc('check_table_exists_in_schema', {
        schema_name: currentSchema,
        table_name: contextualTableName.replace(`${currentSchema}.`, '')
      });
      
      if (error) {
        logger.error('SupabaseSchemaClient', 'Erro ao verificar tabela', error);
        return false;
      }
      
      return data || false;
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
      
      // Usar a função nativa para verificar se o schema existe
      const { data, error } = await supabase.rpc('create_schema_if_not_exists', {
        schema_name: currentSchema
      });
      
      if (error) {
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

  // Método para listar tabelas do schema atual
  async getSchemaTableList(): Promise<string[]> {
    const currentSchema = schemaContext.getCurrentSchema();
    
    try {
      const { data, error } = await supabase.rpc('get_schema_tables', {
        schema_name: currentSchema
      });
      
      if (error) {
        logger.error('SupabaseSchemaClient', 'Erro ao listar tabelas', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      logger.error('SupabaseSchemaClient', 'Erro inesperado ao listar tabelas', error);
      return [];
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
    tableExists: supabaseSchema.tableExists.bind(supabaseSchema),
    getSchemaTableList: supabaseSchema.getSchemaTableList.bind(supabaseSchema)
  };
};
