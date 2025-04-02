
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewEmployeeForm } from "./NewEmployeeForm";
import { Plus } from "lucide-react";
import { useState } from "react";

type NewEmployeeDialogProps = {
  triggerButton?: React.ReactNode;
};

export function NewEmployeeDialog({ triggerButton }: NewEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Funcionário
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Colaborador</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo colaborador para cadastro no sistema.
          </DialogDescription>
        </DialogHeader>
        <NewEmployeeForm onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
