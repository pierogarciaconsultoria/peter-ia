
import { Dialog } from "@/components/ui/dialog";
import { OccurrenceDialogContent } from "./OccurrenceDialogContent";

interface NewOccurrenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewOccurrenceDialog({ isOpen, onClose }: NewOccurrenceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <OccurrenceDialogContent onClose={onClose} />
    </Dialog>
  );
}
