
import { CostItem } from "./types";
import { Card } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "./utils/formatters";

interface CostChartsProps {
  costs: CostItem[];
}

export function CostCharts({ costs }: CostChartsProps) {
  // Prepare data for charts
  
  // 1. Total cost by month
  const monthlyCostData = costs.reduce((acc, cost) => {
    const monthKey = `${cost.month}/${cost.year}`;
    
    const existingMonth = acc.find(item => item.month === monthKey);
    if (existingMonth) {
      existingMonth.totalCost += cost.totalCost;
      existingMonth.count += 1;
    } else {
      acc.push({
        month: monthKey,
        totalCost: cost.totalCost,
        count: 1,
        avgCost: 0
      });
    }
    return acc;
  }, [] as Array<{month: string; totalCost: number; count: number; avgCost: number}>);
  
  // Calculate average
  monthlyCostData.forEach(item => {
    item.avgCost = item.totalCost / item.count;
  });
  
  // 2. Cost distribution (salary vs benefits vs taxes)
  let totalSalaries = 0;
  let totalBenefits = 0;
  let totalTaxes = 0;
  let totalOther = 0;
  
  costs.forEach(cost => {
    totalSalaries += cost.baseSalary;
    totalBenefits += cost.benefits;
    totalTaxes += cost.taxes;
    totalOther += cost.otherCosts;
  });
  
  const costDistributionData = [
    { name: 'Salários', value: totalSalaries },
    { name: 'Benefícios', value: totalBenefits },
    { name: 'Encargos', value: totalTaxes },
    { name: 'Outros', value: totalOther },
  ];
  
  // 3. Employee costs (top 5)
  const employeeCostsMap = costs.reduce((acc, cost) => {
    if (!acc[cost.employeeId]) {
      acc[cost.employeeId] = {
        employeeName: cost.employeeName,
        totalCost: 0,
        count: 0,
        avgCost: 0,
      };
    }
    
    acc[cost.employeeId].totalCost += cost.totalCost;
    acc[cost.employeeId].count += 1;
    return acc;
  }, {} as Record<string, {employeeName: string; totalCost: number; count: number; avgCost: number}>);
  
  const employeeCostData = Object.entries(employeeCostsMap)
    .map(([id, data]) => ({
      id,
      name: data.employeeName,
      totalCost: data.totalCost,
      avgCost: data.totalCost / data.count
    }))
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 5);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number) => [formatCurrency(value), "Valor"];
  
  // Currency formatter for Y axis
  const yAxisFormatter = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short',
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  
  return (
    <div className="space-y-6">
      {costs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível para visualização em gráficos
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Custos Totais por Mês</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyCostData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={yAxisFormatter} />
                    <Tooltip 
                      formatter={customTooltipFormatter}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="totalCost" 
                      name="Custo Total" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avgCost" 
                      name="Custo Médio" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Distribuição de Custos</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {costDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Top 5 Colaboradores por Custo</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeCostData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={yAxisFormatter} />
                  <Tooltip formatter={customTooltipFormatter} />
                  <Legend />
                  <Bar dataKey="totalCost" name="Custo Total" fill="#8884d8" />
                  <Bar dataKey="avgCost" name="Custo Médio" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
