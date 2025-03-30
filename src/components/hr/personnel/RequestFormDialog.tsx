
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
import { RequestFormDialogProps } from "./form/types";
import { RequestFormContent } from "./form/RequestFormContent";
import { useRequestForm } from "./hooks/useRequestForm";

export function RequestFormDialog({ isOpen, onOpenChange, onSubmit, jobPositions }: RequestFormDialogProps) {
  const { form, handleSubmit } = useRequestForm(jobPositions, onSubmit);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Movimentação de Pessoal</DialogTitle>
          <DialogDescription>
            Formulário para solicitação de movimentação de pessoal
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <RequestFormContent 
            form={form} 
            jobPositions={jobPositions}
            onSubmit={handleSubmit}
          />
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={() => handleSubmit()}>Enviar Solicitação</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
