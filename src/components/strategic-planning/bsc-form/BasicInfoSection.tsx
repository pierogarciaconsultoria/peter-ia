
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSectionProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}: BasicInfoSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="objective-title">Objetivo Estratégico</Label>
        <Input
          id="objective-title"
          placeholder="Digite o título do objetivo estratégico"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="objective-description">Descrição</Label>
        <Textarea
          id="objective-description"
          placeholder="Descreva o objetivo em detalhes..."
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}
