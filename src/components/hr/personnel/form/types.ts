
import { RequestFormValues } from "../types";
import { JobPosition } from "../../types";

export interface FormSectionProps {
  form: any; // React Hook Form methods
}

export interface RequestFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormValues) => void;
  jobPositions: JobPosition[];
}
