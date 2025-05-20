
import { QueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Disable frequent refetches
      refetchOnMount: true, // Always refetch on component mount
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast.error(`Erro ao carregar dados: ${error.message}`);
      }
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      onError: (error: Error) => {
        console.error("Mutation error:", error);
        toast.error(`Erro ao processar operação: ${error.message}`);
      }
    }
  }
});
