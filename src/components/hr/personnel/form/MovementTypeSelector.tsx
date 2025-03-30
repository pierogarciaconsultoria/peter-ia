
import { Checkbox } from "@/components/ui/checkbox";
import { FormSectionProps } from "./types";

// List of movement types
export const movementTypes = [
  { id: "hiring", label: "Admissão" },
  { id: "termination", label: "Demissão" },
  { id: "salaryChange", label: "Aumento salarial" },
  { id: "positionChange", label: "Mudança de cargo" },
  { id: "vacation", label: "Férias" },
  { id: "scheduleChange", label: "Mudança de horário" },
  { id: "absence", label: "Falta ao trabalho" },
  { id: "late", label: "Chegou atrasado" },
  { id: "medicalCertificate", label: "Atestado" },
  { id: "cardPunchForgot", label: "Esqueceu de bater cartão" },
  { id: "departmentChange", label: "Mudança de setor" },
  { id: "shiftChange", label: "Troca de turno" },
  { id: "factoryLeave", label: "Autorização saída da fábrica" },
  { id: "writtenWarning", label: "Advertência por escrito" },
  { id: "verbalWarning", label: "Advertência verbal" },
  { id: "overtimeAuth", label: "Autorizado a fazer hora extra" },
  { id: "dayExchange", label: "Troca de dia" },
  { id: "hourCredit", label: "Abono de hora" }
];

export function MovementTypeSelector({ form }: FormSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {movementTypes.map((type) => (
        <div key={type.id} className="flex items-center space-x-2">
          <Checkbox 
            id={type.id}
            checked={form.watch("type") === type.id}
            onCheckedChange={() => form.setValue("type", type.id)}
          />
          <label 
            htmlFor={type.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {type.label}
          </label>
        </div>
      ))}
    </div>
  );
}
