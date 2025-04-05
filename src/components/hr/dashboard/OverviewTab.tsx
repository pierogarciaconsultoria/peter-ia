
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Users, TrendingUp, UserPlus, GraduationCap, AlertTriangle, Calendar
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from "recharts";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChartCard";
import { useNavigate } from "react-router-dom";
import { useHRDashboard } from "./HRDashboardProvider";

export function OverviewTab() {
  const navigate = useNavigate();
  const { dashboardData } = useHRDashboard();
  const { metrics, departmentDistribution, turnoverData } = dashboardData;
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const navigateToSection = (section: string) => {
    navigate("/human-resources", { state: { activeTab: section } });
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Funcionários" 
          value={metrics.totalEmployees}
          description={`+${metrics.newHires} novos este mês`}
          icon={Users}
          buttonLabel="Ver"
          onButtonClick={() => navigateToSection('directory')}
        />
        
        <StatCard 
          title="Taxa de Turnover" 
          value={`${metrics.turnoverRate}%`}
          description={`Média de ${metrics.averageTenure} anos na empresa`}
          icon={TrendingUp}
          buttonLabel="Ver"
          onButtonClick={() => navigateToSection('personnel')}
        />
        
        <StatCard 
          title="Recrutamento" 
          value={metrics.pendingRecruitments}
          description="Processos seletivos em aberto"
          icon={UserPlus}
          buttonLabel="Ver"
          onButtonClick={() => navigateToSection('recruitment-selection')}
        />
        
        <StatCard 
          title="Treinamentos" 
          value={metrics.pendingTrainings}
          description="Pendentes de realização"
          icon={GraduationCap}
          buttonLabel="Ver"
          onButtonClick={() => navigateToSection('training')}
        />
      </div>

      {/* Department Distribution & Turnover Trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard 
          title="Distribuição por Departamento" 
          description="Distribuição de colaboradores por setor"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} colaboradores`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard 
          title="Tendência de Turnover" 
          description="Últimos 6 meses"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={turnoverData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Taxa']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Turnover"
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Existem 3 funcionários com avaliações de desempenho atrasadas. 
            Verifique a aba "Avaliações" para mais detalhes.
          </AlertDescription>
        </Alert>

        <Alert variant="default">
          <Calendar className="h-4 w-4" />
          <AlertTitle>Próximos eventos</AlertTitle>
          <AlertDescription>
            2 processos de admissão, 3 avaliações de período de experiência e 1 reunião 
            de feedback agendados para esta semana.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
