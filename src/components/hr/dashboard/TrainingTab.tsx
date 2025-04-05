
import { 
  GraduationCap, Clock, DollarSign, Award
} from "lucide-react";
import { 
  BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from "recharts";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChartCard";
import { useNavigate } from "react-router-dom";
import { useHRDashboard } from "./HRDashboardProvider";

export function TrainingTab() {
  const navigate = useNavigate();
  const { dashboardData } = useHRDashboard();
  const { trainingCompletionData } = dashboardData;
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const navigateToSection = (section: string) => {
    navigate("/human-resources", { state: { activeTab: section } });
  };

  return (
    <div className="space-y-6">
      {/* Training Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          title="Treinamentos Ativos" 
          value={12}
          description="Em andamento"
          icon={GraduationCap}
        />
        
        <StatCard 
          title="Horas Treinamento" 
          value={78}
          description="No mês atual"
          icon={Clock}
        />
        
        <StatCard 
          title="Orçamento" 
          value="R$ 15.000"
          description="Utilizado: R$ 9.500"
          icon={DollarSign}
        />
        
        <StatCard 
          title="Competências" 
          value={8}
          description="Principais áreas de capacitação"
          icon={Award}
        />
      </div>
      
      {/* Training Completion Status & Department Training Completion */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard 
          title="Status dos Treinamentos" 
          description="Distribuição por status"
          buttonLabel="Ver Detalhes"
          onButtonClick={() => navigateToSection('training')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trainingCompletionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {trainingCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} treinamentos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard 
          title="Treinamento por Departamento" 
          description="Horas de treinamento por departamento"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Administrativo', horas: 15 },
                { name: 'Comercial', horas: 22 },
                { name: 'Financeiro', horas: 12 },
                { name: 'Produção', horas: 18 },
                { name: 'TI', horas: 25 },
                { name: 'RH', horas: 20 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} horas`, 'Duração']} />
              <Bar dataKey="horas" name="Horas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
