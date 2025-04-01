
import { Dialog } from "@/components/ui/dialog";
import { OccurrenceDialogContent } from "./OccurrenceDialogContent";

interface NewOccurrenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: string;
}

export function NewOccurrenceDialog({ isOpen, onClose, employeeId }: NewOccurrenceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <OccurrenceDialogContent onClose={onClose} employeeId={employeeId} />
    </Dialog>
  );
}
