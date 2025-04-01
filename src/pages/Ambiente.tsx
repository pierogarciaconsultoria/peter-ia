
import { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomHeader } from '@/components/ambiente/RoomHeader';
import { RoomFilters } from '@/components/ambiente/RoomFilters';
import { RoomCard } from '@/components/ambiente/RoomCard';
import { RoomForm } from '@/components/ambiente/RoomForm';
import { ReservationForm } from '@/components/ambiente/ReservationForm';
import { ReservationList } from '@/components/ambiente/ReservationList';
import { RoomCalendar } from '@/components/ambiente/RoomCalendar';
import { DeleteConfirmDialog } from '@/components/ambiente/DeleteConfirmDialog';
import { Room, Reservation } from '@/services/roomService';
import { useRooms } from '@/hooks/useRooms';
import { useReservations } from '@/hooks/useReservations';
import { Building2, CalendarDays, ListTodo } from 'lucide-react';

export default function Ambiente() {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <RoomHeader onAddRoom={() => handleOpenRoomForm()} />
          
          <RoomFilters onFilter={handleFilter} />
          
          <Tabs defaultValue="rooms" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="rooms">
                <Building2 className="mr-2 h-4 w-4" />
                Ambientes
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListTodo className="mr-2 h-4 w-4" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendário
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms" className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-60 animate-pulse bg-muted rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRooms.map(room => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onEdit={handleOpenRoomForm}
                      onDelete={(id) => openDeleteDialog(id, 'room')}
                      onReserve={handleOpenReservationForm}
                    />
                  ))}
                  
                  {filteredRooms.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                      <h3 className="text-lg font-medium text-muted-foreground">Nenhum ambiente encontrado</h3>
                      <p className="mt-2">Tente ajustar os filtros ou adicione um novo ambiente.</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 animate-pulse bg-muted rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <ReservationList
                  reservations={reservations}
                  rooms={rooms}
                  onEdit={handleEditReservation}
                  onDelete={(id) => openDeleteDialog(id, 'reservation')}
                />
              )}
            </TabsContent>
            
            <TabsContent value="calendar">
              {isLoading ? (
                <div className="h-96 animate-pulse bg-muted rounded-lg"></div>
              ) : (
                <RoomCalendar
                  reservations={reservations}
                  rooms={rooms}
                  onReserve={handleOpenReservationForm}
                  onEditReservation={handleEditReservation}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Forms */}
      <RoomForm
        isOpen={roomFormOpen}
        onClose={handleCloseRoomForm}
        onSubmit={handleSubmitRoom}
        room={selectedRoom}
      />
      
      <ReservationForm
        isOpen={reservationFormOpen}
        onClose={handleCloseReservationForm}
        onSubmit={handleSubmitReservation}
        rooms={rooms}
        reservation={selectedReservation}
        selectedRoomId={selectedRoomId}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        {...getDeleteDialogProps()}
      />
    </div>
  );
}
