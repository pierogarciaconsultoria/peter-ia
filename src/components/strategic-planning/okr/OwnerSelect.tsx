import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveEmployees } from "@/hooks/useActiveEmployees";

const NONE = "__none__";

interface OwnerSelectProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Seleção de responsável (colaborador ativo) para objetivos, resultados-chave e KPIs. */
export function OwnerSelect({ value, onChange, placeholder = "Selecione o responsável", disabled }: OwnerSelectProps) {
  const { employees, loadingEmployees } = useActiveEmployees();

  return (
    <Select
      value={value || NONE}
      onValueChange={(v) => onChange(v === NONE ? null : v)}
      disabled={disabled || loadingEmployees}
    >
      <SelectTrigger>
        <SelectValue placeholder={loadingEmployees ? "Carregando..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>Sem responsável</SelectItem>
        {employees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.name}
            {employee.department ? ` · ${employee.department}` : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Nome do colaborador a partir do id (para listagens). */
export function useOwnerName() {
  const { employees } = useActiveEmployees();
  return (ownerId: string | null | undefined) => {
    if (!ownerId) return null;
    return employees.find(e => e.id === ownerId)?.name ?? null;
  };
}
