import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createIndicator, updateIndicator, deleteIndicator } from "@/services/indicatorService";
import { IndicatorType } from "@/types/indicators";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

const indicatorSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  process: z.string().min(1, "Processo é obrigatório"),
  goal_type: z.enum(["higher_better", "lower_better", "target"]),
  goal_value: z.coerce.number().min(0, "Meta deve ser um número positivo"),
  calculation_type: z.enum(["sum", "average"]),
  unit: z.string().optional(),
});

type IndicatorFormValues = z.infer<typeof indicatorSchema>;

interface IndicatorFormProps {
  indicator?: IndicatorType;
  onClose: () => void;
  afterSubmit: () => void;
}

export function IndicatorForm({ indicator, onClose, afterSubmit }: IndicatorFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!indicator;
  
  // Set up form with default values
  const form = useForm<IndicatorFormValues>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: indicator ? {
      name: indicator.name,
      description: indicator.description || "",
      process: indicator.process,
      goal_type: indicator.goal_type,
      goal_value: indicator.goal_value,
      calculation_type: indicator.calculation_type,
      unit: indicator.unit || "",
    } : {
      name: "",
      description: "",
      process: "",
      goal_type: "higher_better",
      goal_value: 0,
      calculation_type: "average",
      unit: "",
    },
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: IndicatorFormValues) => {
      // Ensure all required fields are present
      const indicatorData: Omit<IndicatorType, "id" | "created_at" | "updated_at"> = {
        name: data.name,
        description: data.description,
        process: data.process,
        goal_type: data.goal_type,
        goal_value: data.goal_value,
        calculation_type: data.calculation_type,
        unit: data.unit
      };
      return createIndicator(indicatorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicators"] });
      afterSubmit();
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: IndicatorFormValues) => {
      // Ensure all required fields are present
      const indicatorData: Omit<IndicatorType, "id" | "created_at" | "updated_at"> = {
        name: data.name,
        description: data.description,
        process: data.process,
        goal_type: data.goal_type,
        goal_value: data.goal_value,
        calculation_type: data.calculation_type,
        unit: data.unit
      };
      return updateIndicator(indicator!.id, indicatorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicators"] });
      afterSubmit();
    },
  });
  
  // Handle form submission
  function onSubmit(data: IndicatorFormValues) {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }
  
  // Handle delete confirmation
  function confirmDelete() {
    setIsDeleting(true);
    deleteMutation.mutate();
  }
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error || deleteMutation.error;
  
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Indicador" : "Novo Indicador"}
        </DialogTitle>
      </DialogHeader>
      
      {error && (
        <div className="bg-destructive/20 p-3 rounded-md flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Erro</p>
            <p className="text-sm text-destructive">{String(error)}</p>
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Indicador</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                    {...field} 
                    placeholder="Descrição detalhada do indicador" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="process"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Ex: Produção, Qualidade, RH" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="goal_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Meta</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="higher_better">Quanto maior, melhor</SelectItem>
                      <SelectItem value="lower_better">Quanto menor, melhor</SelectItem>
                      <SelectItem value="target">Valor exato</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="goal_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Meta</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="calculation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cálculo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de cálculo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sum">Somatório</SelectItem>
                      <SelectItem value="average">Média</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: %, un, horas" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            {isEditing && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isDeleting && <Trash2 className="mr-2 h-4 w-4" />}
                Excluir
              </Button>
            )}
            
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
