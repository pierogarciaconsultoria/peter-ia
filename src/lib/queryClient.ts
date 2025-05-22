
import { QueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { isProductionEnvironment } from '@/utils/lovableEditorDetection';

// Enhanced error handler that includes connection issue detection
const handleQueryError = (error: Error) => {
  console.error("Query error:", error);
  
  // Check if it's a network error
  if (error.message.includes('Failed to fetch') || 
      error.message.includes('Network error') ||
      error.message.includes('connection') ||
      error.message.includes('timeout')) {
    toast.error(`Erro de conexão`, {
      description: "Verifique sua conexão com a internet."
    });
  } else {
    // Regular error
    toast.error(`Erro ao carregar dados`, {
      description: isProductionEnvironment() ? 
        "Por favor, tente novamente mais tarde." : 
        error.message
    });
  }
};

// Enhanced mutation error handler
const handleMutationError = (error: Error) => {
  console.error("Mutation error:", error);
  
  // Check if it's a network error
  if (error.message.includes('Failed to fetch') || 
      error.message.includes('Network error') ||
      error.message.includes('connection') ||
      error.message.includes('timeout')) {
    toast.error(`Erro de conexão`, {
      description: "Verifique sua conexão com a internet."
    });
  } else {
    // Regular error
    toast.error(`Erro ao processar operação`, {
      description: isProductionEnvironment() ? 
        "Por favor, tente novamente mais tarde." : 
        error.message
    });
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Disable frequent refetches
      refetchOnMount: true, // Always refetch on component mount
      refetchOnReconnect: true, // Refetch on network reconnection
      meta: {
        errorHandler: handleQueryError
      }
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      meta: {
        errorHandler: handleMutationError
      }
    }
  }
});

// Function to reset query cache and refetch critical queries
export const refreshQueryCache = () => {
  // Invalidate and refetch critical queries
  queryClient.invalidateQueries({ queryKey: ['audits-dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['external-audits-dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['hr-trainings'] }); // Nova chave de consulta adicionada
  
  toast.success('Dados atualizados', {
    description: 'Os dados do sistema foram atualizados com sucesso.'
  });
};
