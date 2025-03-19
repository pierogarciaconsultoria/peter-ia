import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
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
import { createMeasurement, getMeasurementsByIndicator, updateMeasurement } from "@/services/indicatorService";
import { IndicatorType, MeasurementType } from "@/types/indicators";
import { AlertCircle, Loader2 } from "lucide-react";

const measurementSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  value: z.coerce.number(),
  notes: z.string().optional(),
});

type MeasurementFormValues = z.infer<typeof measurementSchema>;

interface MonthlyMeasurementFormProps {
  indicator: IndicatorType;
  onClose: () => void;
  afterSubmit: () => void;
}

export function MonthlyMeasurementForm({ 
  indicator, 
  onClose, 
  afterSubmit 
}: MonthlyMeasurementFormProps) {
  const queryClient = useQueryClient();
  const currentDate = new Date();
  
  // Fetch existing measurements for this indicator
  const { data: existingMeasurements = [] } = useQuery({
    queryKey: ["measurements", indicator.id],
    queryFn: () => getMeasurementsByIndicator(indicator.id),
  });
  
  // Find if there's an existing measurement for the current month/year
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const existingMeasurement = existingMeasurements.find(
    m => m.month === currentMonth && m.year === currentYear
  );
  
  const isEditing = !!existingMeasurement;
  
  // Set up form with default values
  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: existingMeasurement ? {
      month: existingMeasurement.month,
      year: existingMeasurement.year,
      value: existingMeasurement.value,
      notes: existingMeasurement.notes || "",
    } : {
      month: currentMonth,
      year: currentYear,
      value: 0,
      notes: "",
    },
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: MeasurementFormValues) => {
      // Ensure all required fields are present
      const measurementData: Omit<MeasurementType, "id" | "created_at" | "updated_at"> = {
        indicator_id: indicator.id,
        month: data.month,
        year: data.year,
        value: data.value,
        notes: data.notes
      };
      return createMeasurement(measurementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      afterSubmit();
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: MeasurementFormValues) => {
      // Ensure all required fields are present
      const measurementData: Omit<MeasurementType, "id" | "created_at" | "updated_at"> = {
        indicator_id: indicator.id,
        month: data.month,
        year: data.year,
        value: data.value,
        notes: data.notes
      };
      return updateMeasurement(existingMeasurement!.id, measurementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      afterSubmit();
    },
  });
  
  // Handle form submission
  function onSubmit(data: MeasurementFormValues) {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;
  
  // Generate month options
  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];
  
  // Generate year options (last 5 years to next year)
  const years = [];
  for (let i = currentYear - 4; i <= currentYear + 1; i++) {
    years.push(i);
  }
  
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Medição" : "Nova Medição"}
        </DialogTitle>
        <DialogDescription>
          Indicador: {indicator.name}
        </DialogDescription>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mês</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem 
                          key={month.value} 
                          value={month.value.toString()}
                        >
                          {month.label}
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem 
                          key={year} 
                          value={year.toString()}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
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
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Observações sobre esta medição" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter className="gap-2 sm:gap-0">
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
