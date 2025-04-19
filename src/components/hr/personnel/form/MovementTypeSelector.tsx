import { FormSectionProps, RequestStatus } from "../types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem } from "@/components/ui/form";

// Lista de tipos de movimentação com informações sobre o módulo destino
export const movementTypes = [
  { id: "hiring", label: "Admissão", targetModule: "admission" },
  { id: "termination", label: "Demissão", targetModule: "termination" },
  { id: "salaryChange", label: "Aumento salarial", targetModule: "hr" },
  { id: "positionChange", label: "Mudança de cargo", targetModule: "hr" },
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
  { id: "hourCredit", label: "Abono de hora", targetModule: "hr" },
  { id: "vacation", label: "Férias", targetModule: "vacation" }
] as const;

export const requestStatus = [
  { id: "new" as RequestStatus, label: "Nova Solicitação" },
  { id: "in_analysis" as RequestStatus, label: "Em Análise" },
  { id: "in_approval" as RequestStatus, label: "Em aprovação" },
  { id: "rejected" as RequestStatus, label: "Reprovado" },
  { id: "approved" as RequestStatus, label: "Aprovado" }
] as const;

export function MovementTypeSelector({ form }: FormSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-medium">Tipo de Movimentação</h3>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de movimentação" />
                </SelectTrigger>
                <SelectContent>
                  {movementTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Status da Solicitação</h3>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(value: RequestStatus) => field.onChange(value)}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {requestStatus.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
