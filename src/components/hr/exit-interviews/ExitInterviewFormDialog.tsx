
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExitInterviewForm } from "./ExitInterviewForm";

export interface ExitInterviewData {
  employeeName: string;
  position: string;
  department: string;
  exitDate: Date;
  reason: string;
  feedback?: string;
  overallExperience: string;
  wouldRecommend: string;
  improvementSuggestions?: string;
}

interface ExitInterviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ExitInterviewData) => void;
  initialData?: Partial<ExitInterviewData>;
}

export function ExitInterviewFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ExitInterviewFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Entrevista de Desligamento</DialogTitle>
          <DialogDescription>
            Registre os detalhes da entrevista de desligamento para ajudar a melhorar processos internos.
          </DialogDescription>
        </DialogHeader>
        
        <ExitInterviewForm 
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
