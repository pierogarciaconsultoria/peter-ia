import { useForm } from "react-hook-form";
import { CalendarIcon, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmployeeSelector } from "../departments/EmployeeSelector";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OccurrenceFormValues } from "./occurrenceTypes";

interface OccurrenceFormFieldsProps {
  form: ReturnType<typeof useForm<OccurrenceFormValues>>;
  employees: any[];
}

export function OccurrenceFormFields({ form, employees }: OccurrenceFormFieldsProps) {
  const typeIcons = {
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    disciplinary: <AlertOctagon className="h-5 w-5 text-red-500" />,
    observation: <Info className="h-5 w-5 text-blue-500" />
  };

  const typeLabels = {
    warning: 'Advertência',
    disciplinary: 'Disciplinar',
    observation: 'Observação'
  };

  return (
    <>
      <FormField
        control={form.control}
        name="employee_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador</FormLabel>
            <FormControl>
              <EmployeeSelector 
                employeeId={field.value} 
                setEmployeeId={field.onChange}
                employees={employees}
                error={form.formState.errors.employee_id?.message}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          rules={{ required: "Selecione um tipo" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Ocorrência</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "warning"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center">
                        {typeIcons[type]}
                        <span className="ml-2">{typeLabels[type]}</span>
                      </div>
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
          name="date"
          rules={{ required: "Data é obrigatória" }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Ocorrência</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="title"
        rules={{ required: "Título é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="Título da ocorrência" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        rules={{ required: "Descrição é obrigatória" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva detalhadamente a ocorrência" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="reported_by"
        rules={{ required: "Nome do relator é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reportado por</FormLabel>
            <FormControl>
              <Input placeholder="Nome de quem está reportando" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
