
import { Room, Reservation } from '@/services/roomService';
import { RoomCard } from './RoomCard';
import { ReservationList } from './ReservationList';
import { RoomCalendar } from './RoomCalendar';
import { TabsContent } from "@/components/ui/tabs";

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
  return (
    <>
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
                onEdit={onEditRoom}
                onDelete={onDeleteRoom}
                onReserve={onReserveRoom}
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
            onEdit={onEditReservation}
            onDelete={onDeleteReservation}
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
            onReserve={onReserveRoom}
            onEditReservation={onEditReservation}
          />
        )}
      </TabsContent>
    </>
  );
}
