
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reservation, Room } from "@/services/roomService";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addDays, 
  isSameDay,
  isWithinInterval,
  parseISO,
  addWeeks,
  subWeeks
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";

interface RoomCalendarProps {
  reservations: Reservation[];
  rooms: Room[];
  onReserve: (roomId?: string) => void;
  onEditReservation: (reservation: Reservation) => void;
}

export function RoomCalendar({ 
  reservations, 
  rooms, 
  onReserve, 
  onEditReservation 
}: RoomCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = useMemo(() => startOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);
  const weekEnd = useMemo(() => endOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);
  const weekDays = useMemo(() => 
    eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd]
  );

  // Function to extract hours and minutes parts from Date object
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  // Check if a reservation is on a particular day and room
  const getReservationsForDayAndRoom = (day: Date, roomId: string) => {
    return reservations.filter(reservation => {
      const startDate = new Date(reservation.startTime);
      return reservation.roomId === roomId && isSameDay(startDate, day);
    }).sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  };

  // Navigation functions
  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={previousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="font-medium"
            onClick={goToToday}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-base sm:text-lg font-medium">
          {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM yyyy", { locale: ptBR })}
        </div>
        
        <Button onClick={() => onReserve()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Reserva
        </Button>
      </div>

      {rooms.map(room => (
        <Card key={room.id} className="overflow-hidden">
          <CardHeader className="bg-muted/40 pb-4">
            <CardTitle className="text-base flex justify-between">
              <span>{room.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => onReserve(room.id)}
              >
                + Reservar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div 
                  key={day.toString()} 
                  className={`text-center py-2 font-medium ${
                    isSameDay(day, new Date()) ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(day, "EEE", { locale: ptBR }).toUpperCase()}
                  </div>
                  <div className="text-base">{format(day, "d")}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 min-h-[150px]">
              {weekDays.map((day) => {
                const dayReservations = getReservationsForDayAndRoom(day, room.id);
                return (
                  <div 
                    key={day.toString()} 
                    className={`p-1 border-r min-h-[150px] ${
                      isSameDay(day, new Date()) ? 'bg-primary/5' : ''
                    }`}
                  >
                    {dayReservations.length > 0 ? (
                      <div className="space-y-1">
                        {dayReservations.map((reservation) => (
                          <Button
                            key={reservation.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left h-auto p-1.5 text-xs bg-card"
                            onClick={() => onEditReservation(reservation)}
                          >
                            <div className="w-full overflow-hidden">
                              <div className="font-medium truncate">{reservation.title}</div>
                              <div className="text-muted-foreground">
                                {formatTime(new Date(reservation.startTime))} - {formatTime(new Date(reservation.endTime))}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        Sem reservas
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
