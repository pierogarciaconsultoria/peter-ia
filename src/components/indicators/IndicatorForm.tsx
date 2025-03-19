
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { createIndicator, updateIndicator, deleteIndicator } from "@/services/indicatorService";
import { IndicatorType } from "@/types/indicators";
import { indicatorSchema, IndicatorFormValues } from "./IndicatorFormSchema";
import { FormError } from "./FormError";
import { IndicatorFormFields } from "./IndicatorFormFields";
import { IndicatorFormActions } from "./IndicatorFormActions";

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
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteIndicator(indicator!.id),
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
      
      <FormError error={error as Error | null} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <IndicatorFormFields control={form.control} />
          
          <DialogFooter className="gap-2 sm:gap-0">
            <IndicatorFormActions 
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              isDeleting={isDeleting}
              onClose={onClose}
              onDelete={confirmDelete}
            />
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
