
import { useState, useEffect, useCallback } from 'react';
import { Room, Reservation } from '@/services/roomService';
import { useRooms } from '@/hooks/useRooms';
import { useReservations } from '@/hooks/useReservations';
import { toast } from 'sonner';

export function useAmbienteState() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [reservationFormOpen, setReservationFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'room' | 'reservation'} | null>(null);

  const { 
    rooms, 
    isLoading: roomsLoading, 
    fetchRooms, 
    addRoom, 
    updateRoom, 
    deleteRoom 
  } = useRooms();

  const { 
    reservations, 
    isLoading: reservationsLoading, 
    fetchReservations,
    addReservation, 
    updateReservation, 
    deleteReservation 
  } = useReservations();

  useEffect(() => {
    fetchRooms();
    fetchReservations();
  }, [fetchRooms, fetchReservations]);

  useEffect(() => {
    // Apply filters to rooms
    let filtered = [...rooms];
    
    if (filterSearch) {
      const searchTerm = filterSearch.toLowerCase();
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchTerm) || 
        (room.description && room.description.toLowerCase().includes(searchTerm)) ||
        (room.location && room.location.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filterType) {
      filtered = filtered.filter(room => room.type === filterType);
    }
    
    setFilteredRooms(filtered);
  }, [rooms, filterSearch, filterType]);

  const handleOpenRoomForm = useCallback((room?: Room) => {
    setSelectedRoom(room);
    setRoomFormOpen(true);
  }, []);

  const handleCloseRoomForm = useCallback(() => {
    setSelectedRoom(undefined);
    setRoomFormOpen(false);
  }, []);

  const handleOpenReservationForm = useCallback((roomId?: string) => {
    setSelectedRoomId(roomId);
    setSelectedReservation(undefined);
    setReservationFormOpen(true);
  }, []);

  const handleCloseReservationForm = useCallback(() => {
    setSelectedRoomId(undefined);
    setSelectedReservation(undefined);
    setReservationFormOpen(false);
  }, []);

  const handleEditReservation = useCallback((reservation: Reservation) => {
    setSelectedReservation(reservation);
    setReservationFormOpen(true);
  }, []);

  const handleFilter = useCallback((search: string, type: string | null) => {
    setFilterSearch(search);
    setFilterType(type);
  }, []);

  const handleSubmitRoom = useCallback(async (data: Omit<Room, 'id'>) => {
    try {
      let success;
      
      if (selectedRoom) {
        success = await updateRoom(selectedRoom.id, data);
      } else {
        success = await addRoom(data);
      }
      
      if (success) {
        handleCloseRoomForm();
        toast.success(selectedRoom ? 'Ambiente atualizado com sucesso' : 'Ambiente criado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar ambiente:', error);
      toast.error('Erro ao salvar ambiente');
    }
  }, [selectedRoom, updateRoom, addRoom, handleCloseRoomForm]);

  const handleSubmitReservation = useCallback(async (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      let success;
      
      if (selectedReservation) {
        success = await updateReservation(selectedReservation.id, data);
      } else {
        success = await addReservation(data);
      }
      
      if (success) {
        handleCloseReservationForm();
        toast.success(selectedReservation ? 'Reserva atualizada com sucesso' : 'Reserva criada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      toast.error('Erro ao salvar reserva');
    }
  }, [selectedReservation, updateReservation, addReservation, handleCloseReservationForm]);

  const openDeleteDialog = useCallback((id: string, type: 'room' | 'reservation') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    
    try {
      let success;
      if (itemToDelete.type === 'room') {
        success = await deleteRoom(itemToDelete.id);
      } else {
        success = await deleteReservation(itemToDelete.id);
      }
      
      if (success) {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        toast.success(itemToDelete.type === 'room' ? 'Ambiente excluído com sucesso' : 'Reserva cancelada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast.error('Erro ao excluir item');
    }
  }, [itemToDelete, deleteRoom, deleteReservation]);

  const getDeleteDialogProps = useCallback(() => {
    if (!itemToDelete) return { title: '', description: '' };
    
    if (itemToDelete.type === 'room') {
      return {
        title: 'Excluir ambiente',
        description: 'Tem certeza que deseja excluir este ambiente? Esta ação não pode ser desfeita e todas as reservas deste ambiente também serão excluídas.'
      };
    } else {
      return {
        title: 'Cancelar reserva',
        description: 'Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.'
      };
    }
  }, [itemToDelete]);

  const isLoading = roomsLoading || reservationsLoading;

  return {
    activeTab,
    setActiveTab,
    roomFormOpen,
    reservationFormOpen,
    selectedRoom,
    selectedReservation,
    selectedRoomId,
    filteredRooms,
    deleteDialogOpen,
    itemToDelete,
    rooms,
    reservations,
    isLoading,
    handleOpenRoomForm,
    handleCloseRoomForm,
    handleOpenReservationForm,
    handleCloseReservationForm,
    handleEditReservation,
    handleFilter,
    handleSubmitRoom,
    handleSubmitReservation,
    openDeleteDialog,
    handleConfirmDelete,
    getDeleteDialogProps,
    setDeleteDialogOpen
  };
}
