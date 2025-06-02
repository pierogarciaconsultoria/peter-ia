
export interface SchemaConfig {
  name: string;
  schema: string;
  tables: {
    [key: string]: string; // nome da tabela padrão -> nome da tabela no schema específico
  };
}

export interface ProjectContext {
  id: string;
  name: string;
  schema: SchemaConfig;
  isActive: boolean;
}

// Configurações dos schemas por projeto
export const SCHEMA_CONFIGS: Record<string, SchemaConfig> = {
  default: {
    name: 'Default',
    schema: 'public',
    tables: {
      // Mapeamento padrão - tabelas do public schema
      companies: 'companies',
      employees: 'employees',
      user_profiles: 'user_profiles',
      departments: 'departments',
      // ... outras tabelas padrão
    }
  },
  metais: {
    name: 'Metais Project',
    schema: 'metais',
    tables: {
      // Mapeamento específico do Metais - usa tabelas do schema metais quando existem
      companies: 'metais.companies',
      employees: 'metais.employees',
      user_profiles: 'public.user_profiles', // continua usando public para auth
      departments: 'metais.departments',
      // ... outras tabelas específicas do Metais
    }
  }
};

// Contexto ativo atual
let currentContext: ProjectContext = {
  id: 'default',
  name: 'Default',
  schema: SCHEMA_CONFIGS.default,
  isActive: true
};

export class SchemaContextManager {
  private static instance: SchemaContextManager;
  
  public static getInstance(): SchemaContextManager {
    if (!SchemaContextManager.instance) {
      SchemaContextManager.instance = new SchemaContextManager();
    }
    return SchemaContextManager.instance;
  }

  // Definir o contexto ativo
  setContext(projectId: string): boolean {
    const config = SCHEMA_CONFIGS[projectId];
    if (!config) {
      console.warn(`Schema config não encontrada para o projeto: ${projectId}`);
      return false;
    }

    currentContext = {
      id: projectId,
      name: config.name,
      schema: config,
      isActive: true
    };

    console.log(`Contexto de schema alterado para: ${config.name} (${config.schema})`);
    return true;
  }

  // Obter o contexto atual
  getCurrentContext(): ProjectContext {
    return currentContext;
  }

  // Obter o nome da tabela baseado no contexto atual
  getTableName(baseTableName: string): string {
    const tableName = currentContext.schema.tables[baseTableName];
    if (!tableName) {
      console.warn(`Tabela ${baseTableName} não encontrada no contexto ${currentContext.id}, usando padrão`);
      return baseTableName;
    }
    return tableName;
  }

  // Obter o schema atual
  getCurrentSchema(): string {
    return currentContext.schema.schema;
  }

  // Verificar se estamos no contexto padrão
  isDefaultContext(): boolean {
    return currentContext.id === 'default';
  }

  // Verificar se estamos no contexto do Metais
  isMetaisContext(): boolean {
    return currentContext.id === 'metais';
  }

  // Resetar para o contexto padrão
  resetToDefault(): void {
    this.setContext('default');
  }

  // Listar todos os contextos disponíveis
  getAvailableContexts(): { id: string; name: string; schema: string }[] {
    return Object.entries(SCHEMA_CONFIGS).map(([id, config]) => ({
      id,
      name: config.name,
      schema: config.schema
    }));
  }
}

// Instância singleton
export const schemaContext = SchemaContextManager.getInstance();

// Hook para detectar automaticamente o contexto baseado na URL ou outros fatores
export const detectProjectContext = (): string => {
  // Verificar URL
  const url = window.location.href;
  if (url.includes('/metais') || url.includes('metais.')) {
    return 'metais';
  }
  
  // Verificar localStorage
  const savedContext = localStorage.getItem('project_context');
  if (savedContext && SCHEMA_CONFIGS[savedContext]) {
    return savedContext;
  }
  
  return 'default';
};

// Função para inicializar o contexto
export const initializeSchemaContext = (): void => {
  const detectedContext = detectProjectContext();
  schemaContext.setContext(detectedContext);
  
  // Salvar no localStorage para persistência
  localStorage.setItem('project_context', detectedContext);
};
