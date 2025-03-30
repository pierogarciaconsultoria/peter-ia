
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "../types";
import { JobPosition } from "../../types";

export interface FormSectionProps {
  form: UseFormReturn<RequestFormValues>;
}

export interface RequestFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormValues) => void;
  jobPositions: JobPosition[];
}
