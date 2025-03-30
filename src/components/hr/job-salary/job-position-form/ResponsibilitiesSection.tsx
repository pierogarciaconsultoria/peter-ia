
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JobPosition } from "../../types";

interface ResponsibilitiesSectionProps {
  formData: JobPosition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ResponsibilitiesSection({ formData, onChange }: ResponsibilitiesSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="main_responsibilities">Principais responsabilidades</Label>
      <Textarea 
        id="main_responsibilities" 
        name="main_responsibilities" 
        rows={4}
        value={formData.main_responsibilities} 
        onChange={onChange} 
      />
    </div>
  );
}
