
import { useState, useCallback } from 'react';
import { Room, roomService } from '@/services/roomService';
import { toast } from 'sonner';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch rooms'));
      toast.error('Erro ao carregar ambientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRoom = useCallback(async (room: Omit<Room, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRoom = await roomService.addRoom(room);
      setRooms(prev => [...prev, newRoom]);
      toast.success('Ambiente adicionado com sucesso');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add room'));
      toast.error('Erro ao adicionar ambiente');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (id: string, room: Partial<Room>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedRoom = await roomService.updateRoom(id, room);
      if (updatedRoom) {
        setRooms(prev => prev.map(r => r.id === id ? updatedRoom : r));
        toast.success('Ambiente atualizado com sucesso');
        return true;
      }
      toast.error('Ambiente não encontrado');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update room'));
      toast.error('Erro ao atualizar ambiente');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteRoom = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await roomService.deleteRoom(id);
      if (success) {
        setRooms(prev => prev.filter(r => r.id !== id));
        toast.success('Ambiente removido com sucesso');
        return true;
      }
      toast.error('Ambiente não encontrado');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete room'));
      toast.error('Erro ao remover ambiente');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    rooms,
    isLoading,
    error,
    fetchRooms,
    addRoom,
    updateRoom,
    deleteRoom
  };
}
