
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TargetSectionProps {
  targetValue: string;
  targetUnit: string;
  onTargetValueChange: (value: string) => void;
  onTargetUnitChange: (value: string) => void;
}

export function TargetSection({
  targetValue,
  targetUnit,
  onTargetValueChange,
  onTargetUnitChange
}: TargetSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="target-value">Meta</Label>
        <Input
          id="target-value"
          type="number"
          placeholder="Valor da meta"
          value={targetValue}
          onChange={(e) => onTargetValueChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target-unit">Unidade</Label>
        <Input
          id="target-unit"
          placeholder="Ex: %, R$, unidades"
          value={targetUnit}
          onChange={(e) => onTargetUnitChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
