
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock3, 
  XCircle
} from "lucide-react";
import { Reservation, Room } from "@/services/roomService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReservationListProps {
  reservations: Reservation[];
  rooms: Room[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservationId: string) => void;
}

export function ReservationList({ reservations, rooms, onEdit, onDelete }: ReservationListProps) {
  // Get room name by ID
  const getRoomName = (id: string) => {
    const room = rooms.find(r => r.id === id);
    return room ? room.name : 'Ambiente não encontrado';
  };

  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  
  const statusIcon = {
    confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
    pending: <Clock3 className="h-4 w-4 text-amber-500" />,
    cancelled: <XCircle className="h-4 w-4 text-red-500" />
  };
  
  const statusText = {
    confirmed: 'Confirmada',
    pending: 'Pendente',
    cancelled: 'Cancelada'
  };

  if (reservations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardDescription className="text-center">
            Nenhuma reserva encontrada
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReservations.map(reservation => (
        <Card key={reservation.id} className="overflow-hidden">
          <CardHeader className="bg-muted/40 pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-base">
                  {reservation.title}
                </CardTitle>
                <CardDescription>
                  {getRoomName(reservation.roomId)}
                </CardDescription>
              </div>
              <Badge className="w-fit flex items-center gap-1">
                {statusIcon[reservation.status]}
                {statusText[reservation.status]}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(reservation.startTime), "dd 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(reservation.startTime), "HH:mm")} - 
                  {format(new Date(reservation.endTime), " HH:mm")}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  {reservation.attendees?.length || 0} participantes
                </div>
              </div>
              
              {reservation.description && (
                <p className="text-sm text-muted-foreground">
                  {reservation.description}
                </p>
              )}
              
              <div className="pt-1 flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">Responsável:</span> {reservation.organizer}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => onEdit(reservation)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(reservation.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
