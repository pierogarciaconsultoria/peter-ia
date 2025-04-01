
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { Reservation } from "@/services/roomService";

interface AttendeesFieldProps {
  form: UseFormReturn<Omit<Reservation, 'id' | 'createdAt'>>;
}

export function AttendeesField({ form }: AttendeesFieldProps) {
  const [attendeeInput, setAttendeeInput] = useState('');

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

  const attendees = form.watch('attendees') || [];

  return (
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
        {attendees.length ? (
          <ul className="space-y-1">
            {attendees.map((attendee, index) => (
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
  );
}
