
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit, MapPin, Trash2, Users } from 'lucide-react';
import { formatDate, formatTime } from './reservation/utils';
import { Room, Reservation } from '@/services/roomService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ReservationListProps {
  reservations: Reservation[];
  rooms: Room[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

export function ReservationList({ reservations, rooms, onEdit, onDelete }: ReservationListProps) {
  // Ordena as reservas por data (mais recente primeiro)
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  // Verifica se a data da reserva é hoje
  const isToday = (date: Date): boolean => {
    const today = new Date();
    const reservationDate = new Date(date);
    return (
      reservationDate.getDate() === today.getDate() &&
      reservationDate.getMonth() === today.getMonth() &&
      reservationDate.getFullYear() === today.getFullYear()
    );
  };

  // Pega o nome da sala baseado no roomId
  const getRoomName = (roomId: string): string => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Ambiente não encontrado';
  };
  
  if (sortedReservations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium">Nenhuma reserva encontrada</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Não existem reservas cadastradas no momento
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReservations.map(reservation => (
        <Card 
          key={reservation.id} 
          className={`overflow-hidden ${isToday(reservation.startTime) ? 'border-red-500 border-2' : ''}`}
        >
          <CardHeader className={`p-4 ${isToday(reservation.startTime) ? 'bg-red-50' : ''}`}>
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium">{reservation.title}</span>
                {isToday(reservation.startTime) && (
                  <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    Hoje
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(reservation)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={() => onDelete(reservation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid gap-2 text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{getRoomName(reservation.roomId)}</span>
              </div>
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{formatDate(reservation.startTime)}</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>
                  {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                </span>
              </div>
              {reservation.attendees && reservation.attendees.length > 0 && (
                <div className="flex items-start">
                  <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{reservation.attendees.join(", ")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
