
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AdditionalInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function AdditionalInfoTab({ formData, setFormData }: AdditionalInfoTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
        <Input
          id="bloodType"
          name="bloodType"
          value={formData.bloodType}
          onChange={handleInputChange}
          placeholder="Ex: A+, O-, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Alergias</Label>
        <Textarea
          id="allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          placeholder="Liste quaisquer alergias conhecidas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disabilities">Necessidades Especiais ou Deficiências</Label>
        <Textarea
          id="disabilities"
          name="disabilities"
          value={formData.disabilities}
          onChange={handleInputChange}
          placeholder="Informe caso possua alguma necessidade especial ou deficiência"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Informações adicionais sobre o funcionário"
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
}
