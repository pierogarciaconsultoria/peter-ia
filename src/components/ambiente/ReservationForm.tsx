
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { Room, Reservation } from "@/services/roomService";
import { format, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Reservation, 'id' | 'createdAt'>) => void;
  rooms: Room[];
  reservation?: Reservation;
  selectedRoomId?: string;
}

export function ReservationForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  rooms, 
  reservation, 
  selectedRoomId 
}: ReservationFormProps) {
  const [attendeeInput, setAttendeeInput] = useState('');

  const form = useForm<Omit<Reservation, 'id' | 'createdAt'>>({
    defaultValues: {
      roomId: selectedRoomId || reservation?.roomId || '',
      title: reservation?.title || '',
      description: reservation?.description || '',
      startTime: reservation?.startTime || new Date(),
      endTime: reservation?.endTime || addHours(new Date(), 1),
      organizer: reservation?.organizer || '',
      attendees: reservation?.attendees || [],
      status: reservation?.status || 'confirmed'
    }
  });

  useEffect(() => {
    if (reservation) {
      form.reset({
        roomId: reservation.roomId,
        title: reservation.title,
        description: reservation.description,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        organizer: reservation.organizer,
        attendees: reservation.attendees,
        status: reservation.status
      });
    } else if (selectedRoomId) {
      form.reset({
        roomId: selectedRoomId,
        title: '',
        description: '',
        startTime: new Date(),
        endTime: addHours(new Date(), 1),
        organizer: '',
        attendees: [],
        status: 'confirmed'
      });
    }
  }, [reservation, selectedRoomId, form]);

  const handleAddAttendee = () => {
    if (attendeeInput.trim()) {
      const currentAttendees = form.getValues().attendees || [];
      if (!currentAttendees.includes(attendeeInput.trim())) {
        form.setValue('attendees', [...currentAttendees, attendeeInput.trim()]);
      }
      setAttendeeInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAttendee();
    }
  };

  const handleRemoveAttendee = (index: number) => {
    const currentAttendees = form.getValues().attendees || [];
    form.setValue('attendees', 
      currentAttendees.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Helper function to generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {reservation ? 'Editar Reserva' : 'Nova Reserva'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="roomId"
              rules={{ required: 'Selecione um ambiente' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambiente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ambiente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Título é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da reserva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                rules={{ required: 'Data/hora inicial é obrigatória' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(field.value);
                              newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                              field.onChange(newDate);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const [hours, minutes] = value.split(':').map(Number);
                          const newDate = new Date(field.value);
                          newDate.setHours(hours, minutes);
                          field.onChange(newDate);
                        }}
                        value={format(field.value, 'HH:mm')}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>
                              {format(field.value, 'HH:mm')}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const [hours, minutes] = value.split(':').map(Number);
                          const newDate = new Date(field.value);
                          newDate.setHours(hours, minutes);
                          field.onChange(newDate);
                        }}
                        value={format(field.value, 'HH:mm')}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>
                              {format(field.value, 'HH:mm')}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o objetivo da reserva" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="organizer"
              rules={{ required: 'Responsável é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="attendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participantes</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nome do participante"
                    />
                    <Button type="button" onClick={handleAddAttendee}>
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    {field.value?.length ? (
                      <ul className="space-y-1">
                        {field.value.map((attendee, index) => (
                          <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                            <span className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              {attendee}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttendee(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <FormDescription>Nenhum participante adicionado</FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {reservation ? 'Atualizar' : 'Confirmar'} Reserva
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
