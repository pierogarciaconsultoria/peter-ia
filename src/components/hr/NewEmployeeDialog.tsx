import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeForm } from "./EmployeeForm";
import { Plus } from "lucide-react";
import { useState } from "react";
type NewEmployeeDialogProps = {
  triggerButton?: React.ReactNode;
};
export function NewEmployeeDialog({
  triggerButton
}: NewEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Colaborador</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo colaborador para cadastro no sistema.
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm onCancel={handleClose} />
      </DialogContent>
    </Dialog>;
}