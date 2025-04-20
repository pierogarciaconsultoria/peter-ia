
import { BscPerspective } from "./strategic-planning";

export interface BscFormProps {
  perspective: BscPerspective['perspective'];
  onSaved: () => void;
  onCancel: () => void;
}

export interface BscFormData {
  title: string;
  description: string;
  targetValue: number;
  targetUnit: string;
}
