
import { FormSectionProps } from "./types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Lista de tipos de movimentação com informações sobre o módulo destino
export const movementTypes = [
  { id: "hiring", label: "Admissão", targetModule: "admission" },
  { id: "termination", label: "Demissão", targetModule: "termination" },
  { id: "salaryChange", label: "Aumento salarial", targetModule: "hr" },
  { id: "positionChange", label: "Mudança de cargo", targetModule: "hr" },
  { id: "vacation", label: "Férias", targetModule: "vacation" },
  { id: "scheduleChange", label: "Mudança de horário", targetModule: "hr" },
  { id: "absence", label: "Falta ao trabalho", targetModule: "attendance" },
  { id: "late", label: "Chegou atrasado", targetModule: "attendance" },
  { id: "medicalCertificate", label: "Atestado", targetModule: "medical" },
  { id: "cardPunchForgot", label: "Esqueceu de bater cartão", targetModule: "attendance" },
  { id: "departmentChange", label: "Mudança de setor", targetModule: "hr" },
  { id: "shiftChange", label: "Troca de turno", targetModule: "hr" },
  { id: "factoryLeave", label: "Autorização saída da fábrica", targetModule: "hr" },
  { id: "writtenWarning", label: "Advertência por escrito", targetModule: "feedback" },
  { id: "verbalWarning", label: "Advertência verbal", targetModule: "feedback" },
  { id: "overtimeAuth", label: "Autorizado a fazer hora extra", targetModule: "hr" },
  { id: "dayExchange", label: "Troca de dia", targetModule: "hr" },
  { id: "hourCredit", label: "Abono de hora", targetModule: "hr" }
] as const;

export const requestStatus = [
  { id: "new", label: "Nova Solicitação" },
  { id: "in_analysis", label: "Em Análise" },
  { id: "in_approval", label: "Em aprovação" },
  { id: "rejected", label: "Reprovado" },
  { id: "approved", label: "Aprovado" }
] as const;

export function MovementTypeSelector({ form }: FormSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-medium">Tipo de Movimentação</h3>
        <div className="grid grid-cols-3 gap-4">
          <RadioGroup
            onValueChange={(value) => form.setValue("type", value)}
            value={form.watch("type")}
            className="grid grid-cols-3 gap-4 col-span-3"
          >
            {movementTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Status da Solicitação</h3>
        <div className="grid grid-cols-3 gap-4">
          <RadioGroup
            onValueChange={(value) => form.setValue("status", value)}
            value={form.watch("status")}
            className="grid grid-cols-3 gap-4 col-span-3"
            defaultValue="new"
          >
            {requestStatus.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <RadioGroupItem value={status.id} id={status.id} />
                <Label htmlFor={status.id} className="cursor-pointer">
                  {status.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
