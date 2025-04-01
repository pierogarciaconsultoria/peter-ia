
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOccurrences } from "@/hooks/useOccurrences";
import { OccurrenceFormValues } from "../occurrenceTypes";
import { Occurrence } from "@/services/occurrenceService";

export function useOccurrenceForm(onClose: () => void, employeeId?: string) {
  const { addOccurrence } = useOccurrences();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OccurrenceFormValues>({
    defaultValues: {
      employee_id: employeeId || '',
      type: 'observation',
      title: '',
      description: '',
      date: new Date(),
      reported_by: ''
    }
  });

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
        toast.success("Ocorrência registrada com sucesso");
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting occurrence:", error);
      toast.error("Erro ao registrar ocorrência");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit
  };
}
