
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

type NonConformingProduct = {
  id: string;
  product_name: string;
  description: string;
  status: "identified" | "isolated" | "reviewed" | "resolved";
  severity: "low" | "medium" | "high";
  created_at: string;
  requirement_id: string;
};

interface NonConformingProductsDashboardProps {
  products: NonConformingProduct[];
}

export const NonConformingProductsDashboard: React.FC<NonConformingProductsDashboardProps> = ({ products }) => {
  // Calculate status distribution
  const statusData = [
    { name: 'Identificado', value: products.filter(p => p.status === 'identified').length },
    { name: 'Isolado', value: products.filter(p => p.status === 'isolated').length },
    { name: 'Analisado', value: products.filter(p => p.status === 'reviewed').length },
    { name: 'Resolvido', value: products.filter(p => p.status === 'resolved').length },
  ];

  // Calculate severity distribution
  const severityData = [
    { name: 'Baixa', value: products.filter(p => p.severity === 'low').length },
    { name: 'Média', value: products.filter(p => p.severity === 'medium').length },
    { name: 'Alta', value: products.filter(p => p.severity === 'high').length },
  ];

  // Calculate requirements distribution (top 5)
  const requirementCounts: Record<string, number> = {};
  products.forEach(product => {
    requirementCounts[product.requirement_id] = (requirementCounts[product.requirement_id] || 0) + 1;
  });

  const requirementData = Object.entries(requirementCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Timeline data (last 6 months)
  const now = new Date();
  const monthlyData = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    
    // Count products created in this month
    const count = products.filter(p => {
      const productDate = new Date(p.created_at);
      return productDate.getMonth() === date.getMonth() && 
             productDate.getFullYear() === date.getFullYear();
    }).length;
    
    monthlyData.push({
      month,
      count
    });
  }

  // Colors for pie charts
  const statusColors = ['#f97316', '#facc15', '#3b82f6', '#10b981'];
  const severityColors = ['#3b82f6', '#f97316', '#ef4444'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Status Distribution (Ring Chart) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Distribuição por Status</CardTitle>
          <CardDescription>Visão geral de produtos não conformes por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Severity Distribution (Horizontal Bar Chart) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Distribuição por Severidade</CardTitle>
          <CardDescription>Quantidade de produtos por nível de severidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={severityData}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                <Bar dataKey="value" fill="#8884d8">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={severityColors[index % severityColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Distribution (Horizontal Bar Chart) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Top Requisitos ISO Relacionados</CardTitle>
          <CardDescription>Requisitos mais frequentes em produtos não conformes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={requirementData}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Timeline (Line Chart) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tendência de Produtos Não Conformes</CardTitle>
          <CardDescription>Quantidade de produtos nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Produtos" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
