
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RoomFormValues } from "./useRoomForm";

interface RoomCapacityFieldProps {
  form: UseFormReturn<RoomFormValues>;
}

export function RoomCapacityField({ form }: RoomCapacityFieldProps) {
  return (
    <FormField
      control={form.control}
      name="capacity"
      rules={{ 
        required: 'Capacidade é obrigatória',
        min: { value: 1, message: 'Mínimo de 1 pessoa' }
      }}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Capacidade</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min={1} 
              placeholder="Capacidade" 
              {...field}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
