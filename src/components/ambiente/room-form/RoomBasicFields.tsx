
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RoomFormValues } from "./useRoomForm";
import { RoomTypeField } from "./RoomTypeField";
import { RoomCapacityField } from "./RoomCapacityField";

interface RoomBasicFieldsProps {
  form: UseFormReturn<RoomFormValues>;
}

export function RoomBasicFields({ form }: RoomBasicFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome do ambiente" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex gap-4">
        <RoomTypeField form={form} />
        <RoomCapacityField form={form} />
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o ambiente" 
                className="resize-none"
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localização</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 1º andar, Bloco B" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
