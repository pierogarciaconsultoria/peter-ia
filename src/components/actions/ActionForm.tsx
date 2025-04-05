
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Action5W2H } from "@/types/actions";
import { useActionForm } from "./hooks/useActionForm";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { FiveWTwoHSection } from "./form/FiveWTwoHSection";
import { CostAndPrioritySection } from "./form/CostAndPrioritySection";
import { StatusSection } from "./form/StatusSection";

type ActionFormProps = {
  action?: Action5W2H;
  onClose: () => void;
  afterSubmit: () => void;
};

export function ActionForm({ action, onClose, afterSubmit }: ActionFormProps) {
  const { form, isSubmitting, onSubmit } = useActionForm({
    action,
    afterSubmit,
    onClose
  });
  
  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{action ? "Editar Ação" : "Nova Ação"}</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para {action ? "atualizar" : "criar"} uma ação baseada na metodologia 5W2H.
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh] pr-4">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <BasicInfoSection control={form.control} />
            <FiveWTwoHSection control={form.control} />
            <CostAndPrioritySection control={form.control} />
            <StatusSection control={form.control} />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : action ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </ScrollArea>
    </DialogContent>
  );
}
