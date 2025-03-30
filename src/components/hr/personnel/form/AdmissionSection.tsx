
import { FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSectionProps } from "./types";

export const admissionTypes = [
  { id: "increase", label: "Aumento de quadro" },
  { id: "replacement", label: "Substituição" },
  { id: "reposition", label: "Reposição" }
];

export function AdmissionSection({ form }: FormSectionProps) {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">ADMISSÃO</h3>
      <div className="grid grid-cols-1 gap-2">
        {admissionTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`admission-${type.id}`}
              checked={form.watch("admissionType") === type.id}
              onCheckedChange={() => form.setValue("admissionType", type.id)}
            />
            <label 
              htmlFor={`admission-${type.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type.label}
            </label>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <FormLabel>Gênero</FormLabel>
        <RadioGroup
          value={form.watch("gender")}
          onValueChange={(value) => form.setValue("gender", value as "male" | "female")}
          className="flex items-center space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <label htmlFor="male">Masculino</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <label htmlFor="female">Feminino</label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
