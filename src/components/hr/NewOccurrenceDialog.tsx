
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
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
import { EmployeeSelector } from "./departments/EmployeeSelector";
import { CalendarIcon, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOccurrences } from "@/hooks/useOccurrences";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Occurrence } from "@/services/occurrenceService";

interface NewOccurrenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OccurrenceFormValues {
  employee_id: string;
  type: 'warning' | 'disciplinary' | 'observation';
  title: string;
  description: string;
  date: Date;
  reported_by: string;
}

export function NewOccurrenceDialog({ isOpen, onClose }: NewOccurrenceDialogProps) {
  const { addOccurrence } = useOccurrences();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OccurrenceFormValues>({
    defaultValues: {
      employee_id: '',
      type: 'observation',
      title: '',
      description: '',
      date: new Date(),
      reported_by: ''
    }
  });

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

  const handleSubmit = async (values: OccurrenceFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newOccurrence: Omit<Occurrence, 'id' | 'created_at' | 'updated_at'> = {
        ...values,
        date: values.date.toISOString().split('T')[0],
        status: 'pending'
      };
      
      const success = await addOccurrence(newOccurrence);
      if (success) {
        form.reset();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Ocorrência</DialogTitle>
          <DialogDescription>
            Registre uma nova ocorrência para um colaborador.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employee_id"
              rules={{ required: "Selecione um colaborador" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Colaborador</FormLabel>
                  <FormControl>
                    <EmployeeSelector 
                      value={field.value} 
                      onChange={field.onChange} 
                      placeholder="Selecione um colaborador"
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
                      defaultValue={field.value}
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Registrar Ocorrência"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
