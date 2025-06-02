
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { schemaContext, ProjectContext, initializeSchemaContext } from '@/utils/schemaContext';
import { supabaseSchema } from '@/utils/supabaseSchemaClient';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface SchemaContextType {
  currentContext: ProjectContext;
  availableContexts: { id: string; name: string; schema: string }[];
  switchContext: (projectId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const SchemaContextReact = createContext<SchemaContextType | undefined>(undefined);

export const SchemaContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentContext, setCurrentContext] = useState<ProjectContext>(schemaContext.getCurrentContext());
  const [availableContexts] = useState(schemaContext.getAvailableContexts());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar contexto na montagem do componente
  useEffect(() => {
    try {
      initializeSchemaContext();
      setCurrentContext(schemaContext.getCurrentContext());
    } catch (err) {
      logger.error('SchemaContextProvider', 'Erro ao inicializar contexto', err);
      setError('Falha ao inicializar contexto de schema');
    }
  }, []);

  const switchContext = useCallback(async (projectId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await supabaseSchema.switchContext(projectId);
      
      if (success) {
        setCurrentContext(schemaContext.getCurrentContext());
        toast.success(`Contexto alterado para: ${schemaContext.getCurrentContext().name}`);
        return true;
      } else {
        setError(`Falha ao alternar para o contexto: ${projectId}`);
        toast.error(`Falha ao alternar contexto para ${projectId}`);
        return false;
      }
    } catch (err: any) {
      const errorMessage = `Erro ao alternar contexto: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
      logger.error('SchemaContextProvider', 'Erro ao alternar contexto', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: SchemaContextType = {
    currentContext,
    availableContexts,
    switchContext,
    isLoading,
    error
  };

  return (
    <SchemaContextReact.Provider value={value}>
      {children}
    </SchemaContextReact.Provider>
  );
};

export const useSchemaContext = (): SchemaContextType => {
  const context = useContext(SchemaContextReact);
  if (!context) {
    throw new Error('useSchemaContext deve ser usado dentro de SchemaContextProvider');
  }
  return context;
};

// Hook simplificado para apenas obter o contexto atual
export const useCurrentSchema = () => {
  const { currentContext } = useSchemaContext();
  return {
    projectId: currentContext.id,
    projectName: currentContext.name,
    schema: currentContext.schema.schema,
    isDefault: currentContext.id === 'default',
    isMetais: currentContext.id === 'metais'
  };
};
