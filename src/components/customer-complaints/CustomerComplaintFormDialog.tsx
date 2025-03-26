
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerComplaintForm } from "./CustomerComplaintForm";
import { useState } from "react";
import { Plus } from "lucide-react";

interface CustomerComplaintFormDialogProps {
  onSuccess: () => void;
}

export function CustomerComplaintFormDialog({ onSuccess }: CustomerComplaintFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Reclamação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Reclamação de Cliente</DialogTitle>
          <DialogDescription>
            Preencha o formulário para registrar uma nova reclamação de cliente.
          </DialogDescription>
        </DialogHeader>
        <CustomerComplaintForm 
          onSuccess={handleSuccess} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
