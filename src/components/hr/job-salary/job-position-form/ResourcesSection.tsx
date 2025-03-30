
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JobPosition } from "../../types";

interface ResourcesSectionProps {
  formData: JobPosition;
  onTextareaChange: (field: keyof JobPosition, value: string[]) => void;
}

export function ResourcesSection({ formData, onTextareaChange }: ResourcesSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="required_resources">Recursos necessários</Label>
        <Textarea 
          id="required_resources" 
          name="required_resources" 
          value={formData.required_resources?.join('\n')} 
          onChange={(e) => onTextareaChange('required_resources', e.target.value.split('\n').filter(item => item.trim() !== ''))}
          placeholder="Digite um recurso por linha"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="required_ppe">EPI (Equipamentos de Proteção Individual)</Label>
        <Textarea 
          id="required_ppe" 
          name="required_ppe" 
          value={formData.required_ppe?.join('\n')} 
          onChange={(e) => onTextareaChange('required_ppe', e.target.value.split('\n').filter(item => item.trim() !== ''))}
          placeholder="Digite um EPI por linha"
          rows={3}
        />
      </div>
    </>
  );
}
