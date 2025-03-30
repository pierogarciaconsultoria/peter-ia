
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobPosition } from "../../types";

interface CompetencySectionProps {
  formData: JobPosition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CompetencySection({ formData, onChange }: CompetencySectionProps) {
  return (
    <div className="space-y-2">
      <Label>Competência</Label>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="education_requirements">Educação</Label>
          <Input 
            id="education_requirements" 
            name="education_requirements" 
            value={formData.education_requirements} 
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skill_requirements">Habilidades</Label>
          <Input 
            id="skill_requirements" 
            name="skill_requirements" 
            value={formData.skill_requirements} 
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="training_requirements">Treinamento</Label>
          <Input 
            id="training_requirements" 
            name="training_requirements" 
            value={formData.training_requirements} 
            onChange={onChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience_requirements">Experiência</Label>
          <Input 
            id="experience_requirements" 
            name="experience_requirements" 
            value={formData.experience_requirements} 
            onChange={onChange} 
          />
        </div>
      </div>
    </div>
  );
}
