
import { Card, CardContent } from "@/components/ui/card";
import { CostItem } from "./types";
import { DollarSign, Clock3, TrendingUp, Users } from "lucide-react";

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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Custo Total</p>
              <h3 className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
              <Clock3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Média Custo/Hora</p>
              <h3 className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageHourlyCost)}/h
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-500/10 rounded-full text-green-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Colaboradores</p>
              <h3 className="text-2xl font-bold">{employeeCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-500/10 rounded-full text-amber-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Maior Custo</p>
              <h3 className="text-lg font-semibold truncate max-w-[200px]">
                {highestCostEmployee ? highestCostEmployee.employeeName : "N/A"}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
