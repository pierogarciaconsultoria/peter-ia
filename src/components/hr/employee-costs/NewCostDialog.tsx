
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCostForm } from "./hooks/useCostForm";
import { EmployeeSelector } from "./components/EmployeeSelector";
import { DateSelector } from "./components/DateSelector";
import { SalaryInputs } from "./components/SalaryInputs";
import { CostItem } from "./types";

interface NewCostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cost: CostItem) => void;
}

export function NewCostDialog({ open, onOpenChange, onSave }: NewCostDialogProps) {
  const {
    employeeId,
    setEmployeeId,
    month,
    setMonth,
    year,
    setYear,
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
    errors,
    handleSubmit,
    mockEmployees,
    currentYear
  } = useCostForm(open, onSave, onOpenChange);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento de Custo</DialogTitle>
          <DialogDescription>
            Adicione um novo lançamento de custo para um colaborador.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <EmployeeSelector 
            employeeId={employeeId}
            setEmployeeId={setEmployeeId}
            error={errors.employeeId}
            employees={mockEmployees}
          />
          
          <DateSelector
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
            currentYear={currentYear}
          />
          
          <SalaryInputs
            baseSalary={baseSalary}
            setBaseSalary={setBaseSalary}
            benefits={benefits}
            setBenefits={setBenefits}
            taxes={taxes}
            setTaxes={setTaxes}
            otherCosts={otherCosts}
            setOtherCosts={setOtherCosts}
            workingHours={workingHours}
            setWorkingHours={setWorkingHours}
            errors={errors}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
