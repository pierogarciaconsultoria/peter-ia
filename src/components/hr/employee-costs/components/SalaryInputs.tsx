
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SalaryInputsProps {
  baseSalary: string;
  setBaseSalary: (value: string) => void;
  benefits: string;
  setBenefits: (value: string) => void;
  taxes: string;
  setTaxes: (value: string) => void;
  otherCosts: string;
  setOtherCosts: (value: string) => void;
  workingHours: string;
  setWorkingHours: (value: string) => void;
  errors: Record<string, string>;
}

export function SalaryInputs({ 
  baseSalary, 
  setBaseSalary, 
  benefits, 
  setBenefits, 
  taxes, 
  setTaxes, 
  otherCosts, 
  setOtherCosts, 
  workingHours, 
  setWorkingHours, 
  errors 
}: SalaryInputsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="baseSalary">Salário Base (R$)</Label>
        <Input
          id="baseSalary"
          type="number"
          step="0.01" 
          min="0"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
          className={errors.baseSalary ? "border-red-500" : ""}
        />
        {errors.baseSalary && <p className="text-sm text-red-500">{errors.baseSalary}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="benefits">Benefícios (R$)</Label>
          <Input
            id="benefits"
            type="number"
            step="0.01" 
            min="0"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="taxes">
            Encargos (R$)
            <span className="text-xs text-muted-foreground ml-1">(calculado automaticamente)</span>
          </Label>
          <Input
            id="taxes"
            type="number"
            step="0.01" 
            min="0"
            value={taxes}
            onChange={(e) => setTaxes(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="otherCosts">Outros Custos (R$)</Label>
          <Input
            id="otherCosts"
            type="number"
            step="0.01" 
            min="0"
            value={otherCosts}
            onChange={(e) => setOtherCosts(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="workingHours">Horas Trabalhadas</Label>
          <Input
            id="workingHours"
            type="number"
            step="1" 
            min="1"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            className={errors.workingHours ? "border-red-500" : ""}
          />
          {errors.workingHours && <p className="text-sm text-red-500">{errors.workingHours}</p>}
        </div>
      </div>
    </>
  );
}
