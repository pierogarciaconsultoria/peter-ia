
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, CalendarDays, ListTodo } from 'lucide-react';
import { AmbienteTabContent } from './AmbienteTabContent';
import { Room, Reservation } from '@/services/roomService';

interface AmbienteTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
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

export function AmbienteTabs({ 
  activeTab, 
  onTabChange,
  isLoading,
  filteredRooms,
  rooms,
  reservations,
  onEditRoom,
  onDeleteRoom,
  onReserveRoom,
  onEditReservation,
  onDeleteReservation
}: AmbienteTabsProps) {
  return (
    <Tabs defaultValue="rooms" value={activeTab} onValueChange={onTabChange}>
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
      
      <TabsContent value="rooms">
        <AmbienteTabContent
          activeTab="rooms"
          isLoading={isLoading}
          filteredRooms={filteredRooms}
          rooms={rooms}
          reservations={reservations}
          onEditRoom={onEditRoom}
          onDeleteRoom={onDeleteRoom}
          onReserveRoom={onReserveRoom}
          onEditReservation={onEditReservation}
          onDeleteReservation={onDeleteReservation}
        />
      </TabsContent>
      
      <TabsContent value="list">
        <AmbienteTabContent
          activeTab="list"
          isLoading={isLoading}
          filteredRooms={filteredRooms}
          rooms={rooms}
          reservations={reservations}
          onEditRoom={onEditRoom}
          onDeleteRoom={onDeleteRoom}
          onReserveRoom={onReserveRoom}
          onEditReservation={onEditReservation}
          onDeleteReservation={onDeleteReservation}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <AmbienteTabContent
          activeTab="calendar"
          isLoading={isLoading}
          filteredRooms={filteredRooms}
          rooms={rooms}
          reservations={reservations}
          onEditRoom={onEditRoom}
          onDeleteRoom={onDeleteRoom}
          onReserveRoom={onReserveRoom}
          onEditReservation={onEditReservation}
          onDeleteReservation={onDeleteReservation}
        />
      </TabsContent>
    </Tabs>
  );
}
