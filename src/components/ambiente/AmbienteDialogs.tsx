
import { Room, Reservation } from '@/services/roomService';
import { RoomForm } from './RoomForm';
import { ReservationForm } from './ReservationForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface AmbienteDialogsProps {
  roomFormOpen: boolean;
  reservationFormOpen: boolean;
  deleteDialogOpen: boolean;
  selectedRoom?: Room;
  selectedReservation?: Reservation;
  selectedRoomId?: string;
  rooms: Room[];
  onCloseRoomForm: () => void;
  onCloseReservationForm: () => void;
  onCloseDeleteDialog: () => void;
  onSubmitRoom: (data: Omit<Room, 'id'>) => Promise<void>;
  onSubmitReservation: (data: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
  onConfirmDelete: () => Promise<void>;
  getDeleteDialogProps: () => { title: string; description: string; };
}

export function AmbienteDialogs({
  roomFormOpen,
  reservationFormOpen,
  deleteDialogOpen,
  selectedRoom,
  selectedReservation,
  selectedRoomId,
  rooms,
  onCloseRoomForm,
  onCloseReservationForm,
  onCloseDeleteDialog,
  onSubmitRoom,
  onSubmitReservation,
  onConfirmDelete,
  getDeleteDialogProps
}: AmbienteDialogsProps) {
  return (
    <>
      <RoomForm
        isOpen={roomFormOpen}
        onClose={onCloseRoomForm}
        onSubmit={onSubmitRoom}
        room={selectedRoom}
      />
      
      <ReservationForm
        isOpen={reservationFormOpen}
        onClose={onCloseReservationForm}
        onSubmit={onSubmitReservation}
        rooms={rooms}
        reservation={selectedReservation}
        selectedRoomId={selectedRoomId}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
        {...getDeleteDialogProps()}
      />
    </>
  );
}
