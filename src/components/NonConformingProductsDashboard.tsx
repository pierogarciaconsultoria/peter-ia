import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type NonConformingProduct = {
  id: string;
  product_name: string;
  description: string;
  status: "identified" | "isolated" | "reviewed" | "resolved";
  severity: "low" | "medium" | "high";
  created_at: string;
  requirement_id: string;
  department: string;
  customer: string;
  non_conformity_type: string;
  immediate_action: string;
  approval_status: "approved" | "rejected" | "pending";
};

interface NonConformingProductsDashboardProps {
  products: NonConformingProduct[];
}

export const NonConformingProductsDashboard: React.FC<NonConformingProductsDashboardProps> = ({ products }) => {
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [monthsToShow, setMonthsToShow] = useState<number>(6);
  
  const filteredProducts = React.useMemo(() => {
    if (periodFilter === "all") return products;
    
    const now = new Date();
    const periodStart = new Date();
    
    switch (periodFilter) {
      case "last30":
        periodStart.setDate(now.getDate() - 30);
        break;
      case "last90":
        periodStart.setDate(now.getDate() - 90);
        break;
      case "last180":
        periodStart.setDate(now.getDate() - 180);
        break;
      case "thisYear":
        periodStart.setMonth(0, 1);
        periodStart.setHours(0, 0, 0, 0);
        break;
      default:
        return products;
    }
    
    return products.filter(p => new Date(p.created_at) >= periodStart);
  }, [products, periodFilter]);

  const departmentData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProducts.forEach(product => {
      const dept = product.department || "Não especificado";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProducts]);

  const customerData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProducts.forEach(product => {
      const customer = product.customer || "Não especificado";
      counts[customer] = (counts[customer] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 customers
  }, [filteredProducts]);

  const productData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProducts.forEach(product => {
      counts[product.product_name] = (counts[product.product_name] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 products
  }, [filteredProducts]);

  const nonConformityTypeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProducts.forEach(product => {
      const type = product.non_conformity_type || "Não especificado";
      counts[type] = (counts[type] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProducts]);

  const immediateActionData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProducts.forEach(product => {
      const action = product.immediate_action || "Não especificado";
      counts[action] = (counts[action] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProducts]);

  const approvalStatusData = React.useMemo(() => {
    const counts = {
      "Aprovado": filteredProducts.filter(p => p.approval_status === "approved").length,
      "Rejeitado": filteredProducts.filter(p => p.approval_status === "rejected").length,
      "Pendente": filteredProducts.filter(p => p.approval_status === "pending").length,
    };
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }));
  }, [filteredProducts]);

  const monthlyData = React.useMemo(() => {
    const now = new Date();
    const monthlyAccumulated: { month: string; count: number; accumulated: number }[] = [];
    let accumulation = 0;
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      
      const count = products.filter(p => {
        const productDate = new Date(p.created_at);
        return productDate.getMonth() === date.getMonth() && 
               productDate.getFullYear() === date.getFullYear();
      }).length;
      
      accumulation += count;
      monthlyAccumulated.push({
        month,
        count,
        accumulated: accumulation
      });
    }
    
    return monthlyAccumulated;
  }, [products, monthsToShow]);

  const chartColors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10b981', '#facc15', '#f43f5e'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center bg-muted p-4 rounded-lg">
        <div>
          <span className="text-sm font-medium mr-2">Período:</span>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="last30">Últimos 30 dias</SelectItem>
              <SelectItem value="last90">Últimos 90 dias</SelectItem>
              <SelectItem value="last180">Últimos 180 dias</SelectItem>
              <SelectItem value="thisYear">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <span className="text-sm font-medium mr-2">Visualização mensal:</span>
          <Select value={monthsToShow.toString()} onValueChange={(value) => setMonthsToShow(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Meses para mostrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribuição por Setor Responsável</CardTitle>
            <CardDescription>Quantidade de produtos não conformes por setor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                  <Bar dataKey="value" fill="#8884d8">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top 5 Clientes</CardTitle>
            <CardDescription>Clientes com mais produtos não conformes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerData}
                  margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                  <Bar dataKey="value" fill="#8884d8">
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top 5 Produtos</CardTitle>
            <CardDescription>Produtos com mais não conformidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ocorrências`, 'Quantidade']} />
                  <Bar dataKey="value" fill="#8884d8">
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tipos de Não Conformidade</CardTitle>
            <CardDescription>Distribuição por tipo de não conformidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={nonConformityTypeData}
                  margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                  <Bar dataKey="value" fill="#8884d8">
                    {nonConformityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Disposição Imediata</CardTitle>
            <CardDescription>Distribuição por tipo de disposição imediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={immediateActionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {immediateActionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status de Aprovação</CardTitle>
            <CardDescription>Distribuição por status de aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={approvalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {approvalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tendência Mensal e Acumulado</CardTitle>
            <CardDescription>Quantidade mensal e acumulada de produtos não conformes</CardDescription>
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
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    const label = name === 'count' ? 'Mensal' : 'Acumulado';
                    return [`${value} produtos`, label];
                  }} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="count" 
                    name="Mensal" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="accumulated" 
                    name="Acumulado" 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
