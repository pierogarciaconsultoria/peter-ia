
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { JobPosition } from "../types";
import { 
  JobPositionDetailsHeader,
  JobPositionDetailsContent,
  JobPositionDetailsFooter
} from "./job-position-details";

interface JobPositionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobPosition: JobPosition;
  onEdit: () => void;
  onApprove: () => void;
  onRevise: () => void;
  onDistribute: () => void;
}

export function JobPositionDetailsDialog({
  isOpen,
  onClose,
  jobPosition,
  onEdit,
  onApprove,
  onRevise,
  onDistribute,
}: JobPositionDetailsDialogProps) {
  if (!jobPosition) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <JobPositionDetailsHeader jobPosition={jobPosition} />
        </DialogHeader>

        <JobPositionDetailsContent jobPosition={jobPosition} />

        <DialogFooter>
          <JobPositionDetailsFooter 
            jobPosition={jobPosition}
            onEdit={onEdit}
            onApprove={onApprove}
            onRevise={onRevise}
            onDistribute={onDistribute}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
