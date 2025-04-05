
import { 
  Users, UserPlus, UserMinus, Calendar, 
} from "lucide-react";
import { 
  BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChartCard";
import { useNavigate } from "react-router-dom";

interface PeopleTabProps {
  metrics: {
    approvedPositions: number;
    filledPositions: number;
    pendingRecruitments: number;
    vacationRequests: number;
  };
  discDistribution: Array<{ name: string; value: number; color: string }>;
  recruitmentStatus: Array<{ name: string; value: number }>;
  evaluationScores: Array<{ name: string; value: number }>;
}

export function PeopleTab({ 
  metrics, 
  discDistribution, 
  recruitmentStatus, 
  evaluationScores 
}: PeopleTabProps) {
  const navigate = useNavigate();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const navigateToSection = (section: string) => {
    navigate("/human-resources", { state: { activeTab: section } });
  };

  return (
    <div className="space-y-6">
      {/* Headcount & Hiring Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          title="Quadro Aprovado" 
          value={metrics.approvedPositions}
          description={`${metrics.approvedPositions - metrics.filledPositions} vagas em aberto`}
          icon={Users}
        />
        
        <StatCard 
          title="Recrutamento" 
          value={metrics.pendingRecruitments}
          description="Processos seletivos ativos"
          icon={UserPlus}
        />
        
        <StatCard 
          title="Desligamentos" 
          value={2}
          description="No último mês"
          icon={UserMinus}
        />
        
        <StatCard 
          title="Férias" 
          value={metrics.vacationRequests}
          description="Solicitações pendentes"
          icon={Calendar}
        />
      </div>
      
      {/* DISC Assessment Distribution & Recruitment Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard 
          title="Perfis DISC" 
          description="Distribuição de perfis comportamentais"
          buttonLabel="Ver Detalhes"
          onButtonClick={() => navigateToSection('disc-assessment')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={discDistribution}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => [`${value} colaboradores`, 'Quantidade']} />
              <Bar dataKey="value">
                {discDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard 
          title="Status de Recrutamento" 
          description="Vagas por status"
          buttonLabel="Ver Detalhes"
          onButtonClick={() => navigateToSection('recruitment-selection')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={recruitmentStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {recruitmentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} vagas`, 'Quantidade']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Performance Evaluation Distribution */}
      <ChartCard 
        title="Distribuição de Avaliações de Desempenho" 
        description="Resultado das últimas avaliações"
        buttonLabel="Ver Detalhes"
        onButtonClick={() => navigateToSection('performance')}
        height="250px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={evaluationScores}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} colaboradores`, 'Quantidade']} />
            <Bar dataKey="value" fill="#8884d8">
              {evaluationScores.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
