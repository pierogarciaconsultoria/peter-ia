
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewOccurrenceForm } from "./NewOccurrenceForm";
import { OccurrenceFormValues } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OccurrenceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OccurrenceFormDialog({ open, onOpenChange }: OccurrenceFormDialogProps) {
  const [employees, setEmployees] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, department')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching employees:', error);
        return;
      }

      setEmployees(data || []);
    };

    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const handleSubmit = async (data: OccurrenceFormValues) => {
    try {
      const { error } = await supabase.from('occurrences').insert({
        employee_id: data.employeeId,
        date: data.occurrenceDate,
        type: data.type,
        title: `Ocorrência ${data.type}`,
        description: data.description,
        reported_by: data.responsible,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Ocorrência registrada",
        description: "A ocorrência foi registrada com sucesso.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating occurrence:', error);
      toast({
        title: "Erro ao registrar ocorrência",
        description: "Ocorreu um erro ao tentar registrar a ocorrência.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ocorrência</DialogTitle>
        </DialogHeader>
        <NewOccurrenceForm
          employees={employees}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
