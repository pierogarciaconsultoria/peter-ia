
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
import { useCallback, memo } from "react";

// Use memo to prevent unnecessary re-renders
const MemoizedRequestFormContent = memo(RequestFormContent);

export function RequestFormDialog({ isOpen, onOpenChange, onSubmit, jobPositions }: RequestFormDialogProps) {
  const { form, handleSubmit, selectedPosition } = useRequestForm(jobPositions, onSubmit);
  
  // Memoize handler to prevent unnecessary re-renders
  const handleDialogSubmit = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);
  
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
          <MemoizedRequestFormContent 
            form={form} 
            jobPositions={jobPositions}
            onSubmit={handleSubmit}
            selectedPosition={selectedPosition}
          />
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleDialogSubmit}>Enviar Solicitação</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
