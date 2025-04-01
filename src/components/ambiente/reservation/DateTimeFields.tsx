
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { Reservation } from "@/services/roomService";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { generateTimeOptions, formatTime } from "./utils";

interface DateTimeFieldsProps {
  form: UseFormReturn<Omit<Reservation, 'id' | 'createdAt'>>;
}

export function DateTimeFields({ form }: DateTimeFieldsProps) {
  const timeOptions = generateTimeOptions();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startTime"
        rules={{ required: 'Data/hora inicial é obrigatória' }}
        render={({ field }) => {
          const date = field.value ? new Date(field.value) : new Date();
          
          return (
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
                        format(date, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        const newDate = new Date(field.value || new Date());
                        newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                        field.onChange(newDate);
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => {
            const currentValue = field.value ? new Date(field.value) : new Date();
            
            return (
              <FormItem>
                <FormLabel>Início</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const [hours, minutes] = value.split(':').map(Number);
                    const newDate = new Date(currentValue);
                    newDate.setHours(hours, minutes);
                    field.onChange(newDate);
                  }}
                  value={formatTime(currentValue)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {formatTime(currentValue)}
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
            );
          }}
        />
        
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => {
            const currentValue = field.value ? new Date(field.value) : new Date();
            
            return (
              <FormItem>
                <FormLabel>Fim</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const [hours, minutes] = value.split(':').map(Number);
                    const newDate = new Date(currentValue);
                    newDate.setHours(hours, minutes);
                    field.onChange(newDate);
                  }}
                  value={formatTime(currentValue)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {formatTime(currentValue)}
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
            );
          }}
        />
      </div>
    </div>
  );
}
