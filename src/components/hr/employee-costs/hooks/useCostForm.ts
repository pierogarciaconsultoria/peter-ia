
import { useState, useEffect } from "react";
import { CostItem } from "../types";
import { v4 as uuidv4 } from "uuid";

type CostFormErrors = Record<string, string>;

// Mock data - moved from the original component
const mockEmployees = [
  { id: '1', name: 'João Silva', department: 'Administração' },
  { id: '2', name: 'Maria Souza', department: 'Vendas' },
  { id: '3', name: 'Carlos Oliveira', department: 'Tecnologia' },
  { id: '4', name: 'Ana Santos', department: 'Recursos Humanos' },
  { id: '5', name: 'Paulo Mendes', department: 'Financeiro' },
];

export function useCostForm(open: boolean, onSave: (cost: CostItem) => void, onOpenChange: (open: boolean) => void) {
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
  
  const [errors, setErrors] = useState<CostFormErrors>({});
  
  // Reset form when dialog opens
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
  
  // Calculate taxes based on base salary
  useEffect(() => {
    if (baseSalary) {
      const baseValue = parseFloat(baseSalary);
      if (!isNaN(baseValue)) {
        setTaxes((baseValue * 0.28).toFixed(2));
      }
    }
  }, [baseSalary]);
  
  const validateForm = () => {
    const newErrors: CostFormErrors = {};
    
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

  return {
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
  };
}
