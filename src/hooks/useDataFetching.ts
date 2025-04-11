
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseDataFetchingOptions<T> {
  initialData?: T[];
  fetchFunction: () => Promise<T[]>;
  errorMessage?: string;
}

export function useDataFetching<T>({ 
  initialData = [], 
  fetchFunction, 
  errorMessage = "Erro ao carregar dados" 
}: UseDataFetchingOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, errorMessage]);

  return {
    data,
    setData,
    loading,
    error,
    fetchData
  };
}
