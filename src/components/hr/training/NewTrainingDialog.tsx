
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { EmployeeSelector } from "../shared/EmployeeSelector";
import { createTraining } from "@/services/trainingService";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  trainingName: z.string().min(2, {
    message: "Training name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional(),
  trainerType: z.enum(["internal", "external"]),
  internalTrainerEmployeeId: z.string().optional(),
  externalTrainerName: z.string().optional(),
  externalTrainerContact: z.string().optional(),
  trainingCost: z.number().optional(),
  isMandatory: z.boolean().default(false),
  targetAudience: z.string().optional(),
  trainingCategory: z.string().optional(),
  status: z.enum(["planned", "in_progress", "completed", "canceled"]).default("planned"),
});

interface NewTrainingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  departments: string[];
  employees: any[];
  procedures: any[];
  onTrainingCreated: (newTraining: any) => void;
}

export function NewTrainingDialog({
  isOpen,
  onOpenChange,
  departments,
  employees,
  procedures,
  onTrainingCreated
}: NewTrainingDialogProps) {
  const [trainerType, setTrainerType] = useState<"internal" | "external">("internal");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingName: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      trainerType: "internal",
      internalTrainerEmployeeId: "",
      externalTrainerName: "",
      externalTrainerContact: "",
      trainingCost: 0,
      isMandatory: false,
      targetAudience: "",
      trainingCategory: "",
      status: "planned",
    },
  });

  function handleTrainerTypeChange(value: "internal" | "external") {
    setTrainerType(value);
    form.setValue("trainerType", value);
  }

  async function onSubmitForm(values: z.infer<typeof formSchema>) {
    try {
      // Transform form data to match the training service format
      const trainingData = {
        title: values.trainingName,
        description: values.description || "",
        trainer: trainerType === "internal" 
          ? employees.find(e => e.id === values.internalTrainerEmployeeId)?.name || "Não definido"
          : values.externalTrainerName || "Treinador externo",
        training_date: values.startDate.toISOString().split('T')[0],
        start_time: values.startDate.toISOString(),
        end_time: values.endDate.toISOString(),
        duration: Math.ceil((values.endDate.getTime() - values.startDate.getTime()) / (1000 * 60 * 60)), // Duration in hours
        department: values.targetAudience || "Todos",
        participants: [],
        status: values.status,
        evaluation_method: values.trainingCategory || "Não definido"
      };
      
      // Call the API to create the training
      const newTraining = await createTraining(trainingData);
      
      // Call the callback function with the new training
      onTrainingCreated(newTraining);
      
      // Show a success toast
      toast({
        title: "Sucesso!",
        description: "Treinamento registrado com sucesso.",
      });
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating training:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o treinamento.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Novo Treinamento</DialogTitle>
          <DialogDescription>
            Crie um novo treinamento para sua empresa.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trainingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Treinamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do treinamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição do treinamento"
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={ptBR}
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel>Data de Término</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={ptBR}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.getValues("startDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Local do treinamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trainingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo do Treinamento</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <Label htmlFor="trainerType">Tipo de Instrutor</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    type="button"
                    variant={trainerType === "internal" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 rounded-md"
                    onClick={() => handleTrainerTypeChange("internal")}
                  >
                    Interno
                  </Button>
                  <Button
                    type="button"
                    variant={trainerType === "external" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 rounded-md"
                    onClick={() => handleTrainerTypeChange("external")}
                  >
                    Externo
                  </Button>
                </div>
              </div>
              
              {trainerType === "internal" ? (
                <FormField
                  control={form.control}
                  name="internalTrainerEmployeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrutor Interno</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o instrutor" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name} - {employee.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="externalTrainerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Instrutor Externo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do instrutor externo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="externalTrainerContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato do Instrutor Externo</FormLabel>
                        <FormControl>
                          <Input placeholder="Contato do instrutor externo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-Alvo</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o departamento alvo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos os Departamentos</SelectItem>
                            {departments.map((department) => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trainingCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria de Treinamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Categoria de treinamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="isMandatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>É Obrigatório</FormLabel>
                      <FormDescription>Marque se o treinamento é obrigatório para todos os funcionários.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planejado</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        
        <DialogFooter className="flex-shrink-0 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmitForm)}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
