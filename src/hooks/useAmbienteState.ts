
import { useState, useEffect } from 'react';
import { Room, Reservation } from '@/services/roomService';
import { useRooms } from '@/hooks/useRooms';
import { useReservations } from '@/hooks/useReservations';

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
        room.description?.toLowerCase().includes(searchTerm) ||
        room.location?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filterType) {
      filtered = filtered.filter(room => room.type === filterType);
    }
    
    setFilteredRooms(filtered);
  }, [rooms, filterSearch, filterType]);

  const handleOpenRoomForm = (room?: Room) => {
    setSelectedRoom(room);
    setRoomFormOpen(true);
  };

  const handleCloseRoomForm = () => {
    setSelectedRoom(undefined);
    setRoomFormOpen(false);
  };

  const handleOpenReservationForm = (roomId?: string) => {
    setSelectedRoomId(roomId);
    setSelectedReservation(undefined);
    setReservationFormOpen(true);
  };

  const handleCloseReservationForm = () => {
    setSelectedRoomId(undefined);
    setSelectedReservation(undefined);
    setReservationFormOpen(false);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setReservationFormOpen(true);
  };

  const handleFilter = (search: string, type: string | null) => {
    setFilterSearch(search);
    setFilterType(type);
  };

  const handleSubmitRoom = async (data: Omit<Room, 'id'>) => {
    let success;
    
    if (selectedRoom) {
      success = await updateRoom(selectedRoom.id, data);
    } else {
      success = await addRoom(data);
    }
    
    if (success) {
      handleCloseRoomForm();
    }
  };

  const handleSubmitReservation = async (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    let success;
    
    if (selectedReservation) {
      success = await updateReservation(selectedReservation.id, data);
    } else {
      success = await addReservation(data);
    }
    
    if (success) {
      handleCloseReservationForm();
    }
  };

  const openDeleteDialog = (id: string, type: 'room' | 'reservation') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    let success;
    if (itemToDelete.type === 'room') {
      success = await deleteRoom(itemToDelete.id);
    } else {
      success = await deleteReservation(itemToDelete.id);
    }
    
    if (success) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getDeleteDialogProps = () => {
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
  };

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
