import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CostItem } from "./types";
import { v4 as uuidv4 } from "uuid";

interface NewCostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cost: CostItem) => void;
}

const mockEmployees = [
  { id: '1', name: 'João Silva', department: 'Administração' },
  { id: '2', name: 'Maria Souza', department: 'Vendas' },
  { id: '3', name: 'Carlos Oliveira', department: 'Tecnologia' },
  { id: '4', name: 'Ana Santos', department: 'Recursos Humanos' },
  { id: '5', name: 'Paulo Mendes', department: 'Financeiro' },
];

export function NewCostDialog({ open, onOpenChange, onSave }: NewCostDialogProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());
  const [baseSalary, setBaseSalary] = useState("");
  const [benefits, setBenefits] = useState("");
  const [taxes, setTaxes] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [workingHours, setWorkingHours] = useState("168"); // Default of ~21 working days x 8 hours
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (open) {
      setEmployeeId("");
      setMonth(currentMonth.toString());
      setYear(currentYear.toString());
      setBaseSalary("");
      setBenefits("");
      setTaxes("");
      setOtherCosts("");
      setWorkingHours("168");
      setErrors({});
    }
  }, [open, currentMonth, currentYear]);
  
  useEffect(() => {
    if (baseSalary) {
      const baseValue = parseFloat(baseSalary);
      if (!isNaN(baseValue)) {
        setTaxes((baseValue * 0.28).toFixed(2));
      }
    }
  }, [baseSalary]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!employeeId) {
      newErrors.employeeId = "Selecione um colaborador";
    }
    
    if (!baseSalary || parseFloat(baseSalary) <= 0) {
      newErrors.baseSalary = "Informe um salário base válido";
    }
    
    if (!workingHours || parseFloat(workingHours) <= 0) {
      newErrors.workingHours = "Informe horas trabalhadas válidas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const selectedEmployee = mockEmployees.find(emp => emp.id === employeeId);
    if (!selectedEmployee) return;
    
    const baseValue = parseFloat(baseSalary) || 0;
    const benefitsValue = parseFloat(benefits) || 0;
    const taxesValue = parseFloat(taxes) || 0;
    const otherValue = parseFloat(otherCosts) || 0;
    const hoursValue = parseFloat(workingHours) || 168;
    
    const totalCost = baseValue + benefitsValue + taxesValue + otherValue;
    const hourCost = totalCost / hoursValue;
    
    const newCost: CostItem = {
      id: uuidv4(),
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      month: parseInt(month),
      year: parseInt(year),
      baseSalary: baseValue,
      benefits: benefitsValue,
      taxes: taxesValue,
      otherCosts: otherValue,
      totalCost,
      workingHours: hoursValue,
      hourCost
    };
    
    onSave(newCost);
    onOpenChange(false);
  };
  
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
          <div className="grid gap-2">
            <Label htmlFor="employee">Colaborador</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger id="employee" className={errors.employeeId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione um colaborador" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="month">Mês</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="year">Ano</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                  <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
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
