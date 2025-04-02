
export type CostItem = {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  baseSalary: number;
  benefits: number;
  taxes: number;
  otherCosts: number;
  totalCost: number;
  workingHours: number;
  hourCost: number;
}

export type EmployeeCostFilter = {
  month?: number;
  year?: number;
  employeeId?: string;
  department?: string;
}

export type CostImportData = {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  benefits: number;
  taxes: number;
  otherCosts: number;
  workingHours: number;
}

export type ImportFormat = {
  headers: string[];
  required: string[];
  sampleData: Record<string, string>[];
}
