
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { IndicatorType } from "@/types/indicators";
import { indicatorSchema, IndicatorFormValues } from "./IndicatorFormSchema";
import { FormError } from "./FormError";
import { IndicatorFormFields } from "./IndicatorFormFields";
import { IndicatorFormActions } from "./IndicatorFormActions";

interface IndicatorFormProps {
  indicator?: IndicatorType | null;
  onClose: () => void;
  afterSubmit: (data: IndicatorFormValues) => void;
}

export function IndicatorForm({ indicator, onClose, afterSubmit }: IndicatorFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
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
  
  // Handle form submission
  function onSubmit(data: IndicatorFormValues) {
    try {
      afterSubmit(data);
    } catch (err) {
      setError(err as Error);
    }
  }
  
  // Handle delete confirmation
  function confirmDelete() {
    setIsDeleting(true);
    // Handle deletion logic here if needed
  }
  
  const isSubmitting = form.formState.isSubmitting;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormError error={error} />
        
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
  );
}
