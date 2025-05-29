
import { Button } from "@/components/ui/button";

interface EmployeeFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function EmployeeFormActions({ onCancel, onSubmit, isSubmitting }: EmployeeFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar Colaborador"}
      </Button>
    </div>
  );
}
