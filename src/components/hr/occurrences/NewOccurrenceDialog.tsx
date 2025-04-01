
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useOccurrences } from "@/hooks/useOccurrences";
import { OccurrenceFormFields } from "./OccurrenceFormFields";
import { OccurrenceFormValues } from "./occurrenceTypes";
import { Occurrence } from "@/services/occurrenceService";

interface NewOccurrenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
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
            <OccurrenceFormFields form={form} />

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
