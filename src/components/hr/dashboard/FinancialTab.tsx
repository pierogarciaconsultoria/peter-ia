
import { 
  DollarSign, Users, Award, TrendingUp
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from "recharts";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChartCard";
import { useNavigate } from "react-router-dom";

interface FinancialTabProps {
  salaryComparisonData: Array<{ 
    position: string; 
    Empresa: number; 
    Mercado: number;
  }>;
  employeeCostsData: Array<{
    month: string;
    salaries: number;
    benefits: number;
    taxes: number;
  }>;
}

export function FinancialTab({ salaryComparisonData, employeeCostsData }: FinancialTabProps) {
  const navigate = useNavigate();
  
  const navigateToSection = (section: string) => {
    navigate("/human-resources", { state: { activeTab: section } });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          title="Custo Total" 
          value="R$ 281.500"
          description="Este mês"
          icon={DollarSign}
        />
        
        <StatCard 
          title="Custo Médio" 
          value="R$ 6.702"
          description="Por colaborador"
          icon={Users}
        />
        
        <StatCard 
          title="Benefícios" 
          value="R$ 50.000"
          description="17,7% do custo total"
          icon={Award}
        />
        
        <StatCard 
          title="Encargos" 
          value="R$ 66.000"
          description="23,4% do custo total"
          icon={TrendingUp}
        />
      </div>
      
      {/* Salary Market Comparison & Cost Trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard 
          title="Comparativo Salarial" 
          description="Comparação com mercado"
          buttonLabel="Ver Detalhes"
          onButtonClick={() => navigateToSection('salary')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salaryComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position" angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', '')} />
              <Tooltip formatter={(value: any) => {
                if (typeof value === 'number') {
                  return formatCurrency(value);
                }
                return value.toString();
              }} />
              <Legend />
              <Bar dataKey="Empresa" fill="#8884d8" />
              <Bar dataKey="Mercado" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard 
          title="Evolução dos Custos de Pessoal" 
          description="Últimos 6 meses"
          buttonLabel="Ver Detalhes"
          onButtonClick={() => navigateToSection('employee-costs')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={employeeCostsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value/1000}k`} />
              <Tooltip formatter={(value: any) => {
                if (typeof value === 'number') {
                  return formatCurrency(value);
                }
                return value.toString();
              }} />
              <Legend />
              <Bar dataKey="salaries" name="Salários" stackId="a" fill="#8884d8" />
              <Bar dataKey="benefits" name="Benefícios" stackId="a" fill="#82ca9d" />
              <Bar dataKey="taxes" name="Encargos" stackId="a" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
