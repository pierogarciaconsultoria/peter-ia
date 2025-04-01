
import { useState, useCallback } from 'react';
import { Reservation, reservationService } from '@/services/roomService';
import { toast } from 'sonner';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reservations'));
      toast.error('Erro ao carregar reservas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReservationsByRoom = useCallback(async (roomId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationService.getReservationsByRoomId(roomId);
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reservations'));
      toast.error('Erro ao carregar reservas do ambiente');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReservation = useCallback(async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if the room is available for the specified time
      const isAvailable = await reservationService.checkAvailability(
        reservation.roomId, 
        reservation.startTime, 
        reservation.endTime
      );
      
      if (!isAvailable) {
        toast.error('Ambiente não disponível para este horário');
        return false;
      }
      
      const newReservation = await reservationService.addReservation(reservation);
      setReservations(prev => [...prev, newReservation]);
      toast.success('Reserva realizada com sucesso');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add reservation'));
      toast.error('Erro ao fazer reserva');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (id: string, reservation: Partial<Reservation>) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentReservation = reservations.find(r => r.id === id);
      if (!currentReservation) {
        toast.error('Reserva não encontrada');
        return false;
      }
      
      // If changing time or room, check availability
      if ((reservation.startTime || reservation.endTime || reservation.roomId) && 
          currentReservation) {
        const startTime = reservation.startTime || currentReservation.startTime;
        const endTime = reservation.endTime || currentReservation.endTime;
        const roomId = reservation.roomId || currentReservation.roomId;
        
        const isAvailable = await reservationService.checkAvailability(
          roomId, startTime, endTime, id
        );
        
        if (!isAvailable) {
          toast.error('Ambiente não disponível para este horário');
          return false;
        }
      }
      
      const updatedReservation = await reservationService.updateReservation(id, reservation);
      if (updatedReservation) {
        setReservations(prev => prev.map(r => r.id === id ? updatedReservation : r));
        toast.success('Reserva atualizada com sucesso');
        return true;
      }
      toast.error('Reserva não encontrada');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update reservation'));
      toast.error('Erro ao atualizar reserva');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [reservations]);

  const deleteReservation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await reservationService.deleteReservation(id);
      if (success) {
        setReservations(prev => prev.filter(r => r.id !== id));
        toast.success('Reserva cancelada com sucesso');
        return true;
      }
      toast.error('Reserva não encontrada');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete reservation'));
      toast.error('Erro ao cancelar reserva');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reservations,
    isLoading,
    error,
    fetchReservations,
    fetchReservationsByRoom,
    addReservation,
    updateReservation,
    deleteReservation
  };
}
