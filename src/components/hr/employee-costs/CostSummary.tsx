
import { CostItem } from "./types";
import { StatCard } from "./components/StatCard";
import { DollarSign, Clock3, TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "./utils/formatters";

interface CostSummaryProps {
  costsData: CostItem[];
}

export function CostSummary({ costsData }: CostSummaryProps) {
  // Calculate summary stats
  const totalCost = costsData.reduce((sum, cost) => sum + cost.totalCost, 0);
  
  // Calculate average hourly cost
  const totalHourCost = costsData.reduce((sum, cost) => sum + cost.hourCost, 0);
  const averageHourlyCost = costsData.length > 0 ? totalHourCost / costsData.length : 0;
  
  // Get unique employee count
  const uniqueEmployees = new Set(costsData.map(cost => cost.employeeId));
  const employeeCount = uniqueEmployees.size;
  
  // Get highest cost employee
  const highestCostEmployee = costsData.length > 0 
    ? costsData.reduce((prev, current) => (prev.totalCost > current.totalCost) ? prev : current)
    : null;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        icon={DollarSign}
        iconColor="primary"
        label="Custo Total"
        value={formatCurrency(totalCost)}
      />
      
      <StatCard 
        icon={Clock3}
        iconColor="blue"
        label="Média Custo/Hora"
        value={`${formatCurrency(averageHourlyCost)}/h`}
      />
      
      <StatCard 
        icon={Users}
        iconColor="green"
        label="Colaboradores"
        value={employeeCount}
      />
      
      <StatCard 
        icon={TrendingUp}
        iconColor="amber"
        label="Maior Custo"
        value={highestCostEmployee ? highestCostEmployee.employeeName : "N/A"}
      />
    </div>
  );
}
