
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RoomHeader } from '@/components/ambiente/RoomHeader';
import { RoomFilters } from '@/components/ambiente/RoomFilters';
import { AmbienteTabs } from '@/components/ambiente/AmbienteTabs';
import { AmbienteDialogs } from '@/components/ambiente/AmbienteDialogs';
import { useAmbienteState } from '@/hooks/useAmbienteState';

export default function Ambiente() {
  const {
    activeTab,
    setActiveTab,
    roomFormOpen,
    reservationFormOpen,
    selectedRoom,
    selectedReservation,
    selectedRoomId,
    filteredRooms,
    deleteDialogOpen,
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
  } = useAmbienteState();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <RoomHeader onAddRoom={() => handleOpenRoomForm()} />
          
          <RoomFilters onFilter={handleFilter} />
          
          <AmbienteTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            isLoading={isLoading}
            filteredRooms={filteredRooms}
            rooms={rooms}
            reservations={reservations}
            onEditRoom={handleOpenRoomForm}
            onDeleteRoom={(id) => openDeleteDialog(id, 'room')}
            onReserveRoom={handleOpenReservationForm}
            onEditReservation={handleEditReservation}
            onDeleteReservation={(id) => openDeleteDialog(id, 'reservation')}
          />
        </div>
      </main>
      
      <Footer />
      
      <AmbienteDialogs
        roomFormOpen={roomFormOpen}
        reservationFormOpen={reservationFormOpen}
        deleteDialogOpen={deleteDialogOpen}
        selectedRoom={selectedRoom}
        selectedReservation={selectedReservation}
        selectedRoomId={selectedRoomId}
        rooms={rooms}
        onCloseRoomForm={handleCloseRoomForm}
        onCloseReservationForm={handleCloseReservationForm}
        onCloseDeleteDialog={() => setDeleteDialogOpen(false)}
        onSubmitRoom={handleSubmitRoom}
        onSubmitReservation={handleSubmitReservation}
        onConfirmDelete={handleConfirmDelete}
        getDeleteDialogProps={getDeleteDialogProps}
      />
    </div>
  );
}
