
import {
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
import { UseFormReturn } from "react-hook-form";
import { RoomFormValues } from "./useRoomForm";

interface RoomTypeFieldProps {
  form: UseFormReturn<RoomFormValues>;
}

export function RoomTypeField({ form }: RoomTypeFieldProps) {
  const roomTypes = [
    { value: 'meeting', label: 'Sala de Reunião' },
    { value: 'training', label: 'Sala de Treinamento' },
    { value: 'service', label: 'Sala de Atendimento' },
    { value: 'other', label: 'Outro' }
  ];

  return (
    <FormField
      control={form.control}
      name="type"
      rules={{ required: 'Tipo é obrigatório' }}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Tipo</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roomTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
