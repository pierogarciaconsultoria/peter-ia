
import { useState, useEffect } from 'react';
import { RoomHeader } from '@/components/ambiente/RoomHeader';
import { RoomFilters } from '@/components/ambiente/RoomFilters';
import { AmbienteTabContent } from '@/components/ambiente/AmbienteTabContent';
import { AmbienteDialogs } from '@/components/ambiente/AmbienteDialogs';
import { AmbienteTabs } from '@/components/ambiente/AmbienteTabs';
import { useAmbienteState } from '@/hooks/useAmbienteState';
import { useSidebar as useCustomSidebar } from "@/contexts/SidebarContext";

export function AmbienteContent() {
  const { collapsed } = useCustomSidebar();
  
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
    <div className="space-y-6">
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
