
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarRange, Edit, Trash2 } from "lucide-react";
import { Room } from "@/services/roomService";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  onReserve: (roomId: string) => void;
}

export function RoomCard({ room, onEdit, onDelete, onReserve }: RoomCardProps) {
  const typeLabel = {
    'meeting': 'Sala de Reunião',
    'training': 'Sala de Treinamento',
    'service': 'Sala de Atendimento',
    'other': 'Outro'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <CardDescription className="mt-1">{room.description}</CardDescription>
          </div>
          <Badge variant="outline">{typeLabel[room.type]}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Capacidade: {room.capacity} pessoas</span>
          </div>
          {room.location && (
            <div className="text-sm">
              <span className="font-medium">Localização:</span> {room.location}
            </div>
          )}
          
          <div>
            <span className="text-sm font-medium">Recursos:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {room.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(room)}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(room.id)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Excluir
          </Button>
        </div>
        
        <Button onClick={() => onReserve(room.id)}>
          <CalendarRange className="h-4 w-4 mr-2" />
          Reservar
        </Button>
      </CardFooter>
    </Card>
  );
}
