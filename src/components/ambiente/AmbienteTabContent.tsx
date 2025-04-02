
import { Room, Reservation } from '@/services/roomService';
import { RoomCard } from './RoomCard';
import { ReservationList } from './ReservationList';
import { RoomCalendar } from './RoomCalendar';

interface AmbienteTabContentProps {
  activeTab: string;
  isLoading: boolean;
  filteredRooms: Room[];
  rooms: Room[];
  reservations: Reservation[];
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
  onReserveRoom: (roomId: string) => void;
  onEditReservation: (reservation: Reservation) => void;
  onDeleteReservation: (id: string) => void;
}

export function AmbienteTabContent({
  activeTab,
  isLoading,
  filteredRooms,
  rooms,
  reservations,
  onEditRoom,
  onDeleteRoom,
  onReserveRoom,
  onEditReservation,
  onDeleteReservation
}: AmbienteTabContentProps) {
  // Make sure filteredRooms is never undefined
  const roomsToDisplay = Array.isArray(filteredRooms) ? filteredRooms : [];
  const roomsList = Array.isArray(rooms) ? rooms : [];
  const reservationsList = Array.isArray(reservations) ? reservations : [];
  
  return (
    <>
      {activeTab === "rooms" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-60 animate-pulse bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomsToDisplay.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEdit={onEditRoom}
                  onDelete={onDeleteRoom}
                  onReserve={onReserveRoom}
                />
              ))}
              
              {roomsToDisplay.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <h3 className="text-lg font-medium text-muted-foreground">Nenhum ambiente encontrado</h3>
                  <p className="mt-2">Tente ajustar os filtros ou adicione um novo ambiente.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {activeTab === "list" && (
        <div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 animate-pulse bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : (
            <ReservationList
              reservations={reservationsList}
              rooms={roomsList}
              onEdit={onEditReservation}
              onDelete={onDeleteReservation}
            />
          )}
        </div>
      )}
      
      {activeTab === "calendar" && (
        <div>
          {isLoading ? (
            <div className="h-96 animate-pulse bg-muted rounded-lg"></div>
          ) : (
            <RoomCalendar
              reservations={reservationsList}
              rooms={roomsList}
              onReserve={onReserveRoom}
              onEditReservation={onEditReservation}
            />
          )}
        </div>
      )}
    </>
  );
}
