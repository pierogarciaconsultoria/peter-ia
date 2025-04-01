
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Room, Reservation } from "@/services/roomService";
import { addHours } from "date-fns";
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
  FormMessage
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DateTimeFields } from "./DateTimeFields";
import { AttendeesField } from "./AttendeesField";

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
        startTime: new Date(reservation.startTime),
        endTime: new Date(reservation.endTime),
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

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

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
            
            <DateTimeFields form={form} />
            
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
              render={() => (
                <AttendeesField form={form} />
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
