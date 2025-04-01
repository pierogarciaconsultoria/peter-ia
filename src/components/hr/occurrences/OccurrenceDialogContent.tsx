
import { Form } from "@/components/ui/form";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OccurrenceFormFields } from "./OccurrenceFormFields";
import { useOccurrenceForm } from "./hooks/useOccurrenceForm";

interface OccurrenceDialogContentProps {
  onClose: () => void;
}

export function OccurrenceDialogContent({ onClose }: OccurrenceDialogContentProps) {
  const { form, isSubmitting, handleSubmit } = useOccurrenceForm(onClose);

  return (
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
  );
}
