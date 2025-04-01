
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getOccurrences,
  createOccurrence,
  updateOccurrence,
  deleteOccurrence,
  Occurrence,
  OccurrenceWithEmployee
} from '@/services/occurrenceService';

export function useOccurrences() {
  const [occurrences, setOccurrences] = useState<OccurrenceWithEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOccurrences = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getOccurrences();
      setOccurrences(data);
    } catch (err) {
      console.error("Error fetching occurrences:", err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar ocorrências'));
      toast.error("Falha ao carregar ocorrências");
    } finally {
      setIsLoading(false);
    }
  };

  const addOccurrence = async (occurrence: Omit<Occurrence, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createOccurrence(occurrence);
      toast.success("Ocorrência registrada com sucesso");
      await fetchOccurrences();
      return true;
    } catch (err) {
      console.error("Error creating occurrence:", err);
      toast.error("Falha ao registrar ocorrência");
      return false;
    }
  };

  const updateOccurrenceStatus = async (id: string, status: 'pending' | 'in_progress' | 'resolved') => {
    try {
      await updateOccurrence(id, { status });
      toast.success("Status atualizado com sucesso");
      await fetchOccurrences();
      return true;
    } catch (err) {
      console.error("Error updating occurrence:", err);
      toast.error("Falha ao atualizar status");
      return false;
    }
  };

  const removeOccurrence = async (id: string) => {
    try {
      await deleteOccurrence(id);
      toast.success("Ocorrência removida com sucesso");
      await fetchOccurrences();
      return true;
    } catch (err) {
      console.error("Error deleting occurrence:", err);
      toast.error("Falha ao remover ocorrência");
      return false;
    }
  };

  useEffect(() => {
    fetchOccurrences();
  }, []);

  return {
    occurrences,
    isLoading,
    error,
    fetchOccurrences,
    addOccurrence,
    updateOccurrenceStatus,
    removeOccurrence
  };
}
