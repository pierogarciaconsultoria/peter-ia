
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdditionalInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function AdditionalInfoTab({ formData, setFormData }: AdditionalInfoTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
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
