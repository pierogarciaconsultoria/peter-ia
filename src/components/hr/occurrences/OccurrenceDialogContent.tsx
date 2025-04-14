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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OccurrenceDialogContentProps {
  onClose: () => void;
  employeeId?: string;
}

export function OccurrenceDialogContent({ onClose, employeeId }: OccurrenceDialogContentProps) {
  const { form, isSubmitting, handleSubmit } = useOccurrenceForm(onClose, employeeId);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, department')
        .eq('status', 'active');
        
      if (!error && data) {
        setEmployees(data);
      }
    };
    
    fetchEmployees();
  }, []);

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
          <OccurrenceFormFields form={form} employees={employees} />

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
