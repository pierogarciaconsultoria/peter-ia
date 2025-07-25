
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseSupabaseQueryOptions<T> {
  table: string;
  columns?: string;
  limit?: number;
  orderBy?: { column: string; ascending?: boolean };
  filters?: { column: string; operator: string; value: any }[];
}

export function useSupabaseQuery<T>({
  table,
  columns = '*',
  limit = 100,
  orderBy,
  filters = []
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number | null>(null);

  const fetchData = useCallback(async (customOptions?: Partial<UseSupabaseQueryOptions<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from(customOptions?.table || table as any)
        .select(customOptions?.columns || columns, { count: 'exact' });
      
      // Apply filters
      const filtersToApply = customOptions?.filters || filters;
      filtersToApply.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value);
      });
      
      // Apply ordering
      const order = customOptions?.orderBy || orderBy;
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }
      
      // Apply limit
      if (customOptions?.limit || limit) {
        query = query.limit(customOptions?.limit || limit);
      }
      
      const { data: result, error: queryError, count: resultCount } = await query;
      
      if (queryError) throw queryError;
      
      setData(result as T[]);
      setCount(resultCount);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [table, columns, limit, orderBy, filters]);
  
  return {
    data,
    loading,
    error,
    count,
    fetchData,
    setData
  };
}
