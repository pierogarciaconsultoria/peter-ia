import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Info, Users, Award, GraduationCap, AlertTriangle, DollarSign, 
  TrendingUp, UserPlus, UserMinus, Calendar, Clock 
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HRDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const metrics = {
    totalEmployees: 42,
    newHires: 3,
    upcomingEvaluations: 5,
    pendingTrainings: 8,
    departments: 6,
    turnoverRate: 4.2, // percentage
    averageTenure: 2.7, // years
    pendingRecruitments: 3,
    vacationRequests: 2,
    approvedPositions: 48,
    filledPositions: 42,
    medicalLeaves: 1
  };

  const departmentDistribution = [
    { name: 'Administrativo', value: 10 },
    { name: 'Comercial', value: 8 },
    { name: 'Financeiro', value: 6 },
    { name: 'Produção', value: 12 },
    { name: 'TI', value: 4 },
    { name: 'RH', value: 2 }
  ];
  
  const turnoverData = [
    { month: 'Jan', value: 2.1 },
    { month: 'Fev', value: 1.8 },
    { month: 'Mar', value: 3.2 },
    { month: 'Abr', value: 2.7 },
    { month: 'Mai', value: 3.8 },
    { month: 'Jun', value: 4.2 }
  ];
  
  const recruitmentStatus = [
    { name: 'Abertas', value: 3 },
    { name: 'Em processo', value: 5 },
    { name: 'Concluídas', value: 4 }
  ];
  
  const trainingCompletionData = [
    { name: 'Completos', value: 28 },
    { name: 'Em progresso', value: 12 },
    { name: 'Não iniciados', value: 8 }
  ];

  const evaluationScores = [
    { name: 'Excelente', value: 15 },
    { name: 'Bom', value: 18 },
    { name: 'Regular', value: 7 },
    { name: 'Precisa melhorar', value: 2 }
  ];
  
  const salaryComparisonData = [
    { 
      position: 'Dev Junior', 
      'Empresa': 4200,
      'Mercado': 4500 
    },
    { 
      position: 'Dev Pleno', 
      'Empresa': 6500,
      'Mercado': 7000 
    },
    { 
      position: 'Dev Senior', 
      'Empresa': 10000,
      'Mercado': 11000 
    },
    { 
      position: 'Analista RH', 
      'Empresa': 3800,
      'Mercado': 3500 
    },
    { 
      position: 'Gerente', 
      'Empresa': 12000,
      'Mercado': 13500 
    }
  ];
  
  const employeeCostsData = [
    { month: 'Jan', salaries: 150000, benefits: 45000, taxes: 60000 },
    { month: 'Fev', salaries: 152000, benefits: 46000, taxes: 61000 },
    { month: 'Mar', salaries: 155000, benefits: 47000, taxes: 62000 },
    { month: 'Abr', salaries: 160000, benefits: 48000, taxes: 64000 },
    { month: 'Mai', salaries: 162000, benefits: 48500, taxes: 65000 },
    { month: 'Jun', salaries: 165000, benefits: 50000, taxes: 66000 }
  ];
  
  const discDistribution = [
    { name: 'D (Dominante)', value: 12, color: '#ef4444' },
    { name: 'I (Influente)', value: 15, color: '#eab308' },
    { name: 'S (Estável)', value: 10, color: '#22c55e' },
    { name: 'C (Conformista)', value: 5, color: '#3b82f6' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const navigateToSection = (section: string) => {
    navigate("/human-resources", { state: { activeTab: section } });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="people">Pessoas</TabsTrigger>
          <TabsTrigger value="training">Capacitação</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    +{metrics.newHires} novos este mês
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => navigateToSection('directory')}>
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Turnover</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.turnoverRate}%</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    Média de {metrics.averageTenure} anos na empresa
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => navigateToSection('personnel')}>
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recrutamento</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingRecruitments}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    Processos seletivos em aberto
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => navigateToSection('recruitment-selection')}>
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinamentos</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingTrainings}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    Pendentes de realização
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => navigateToSection('training')}>
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Distribution & Turnover Trend */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Departamento</CardTitle>
                <CardDescription>Distribuição de colaboradores por setor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Turnover</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
              </CardContent>
            </Card>
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
        </TabsContent>
        
        <TabsContent value="people" className="space-y-6">
          {/* Headcount & Hiring Status */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quadro Aprovado</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.approvedPositions}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.approvedPositions - metrics.filledPositions} vagas em aberto
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recrutamento</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingRecruitments}</div>
                <p className="text-xs text-muted-foreground">
                  Processos seletivos ativos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Desligamentos</CardTitle>
                <UserMinus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  No último mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Férias</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.vacationRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Solicitações pendentes
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* DISC Assessment Distribution & Recruitment Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Perfis DISC</CardTitle>
                <CardDescription>Distribuição de perfis comportamentais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
                <div className="mt-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => navigateToSection('disc-assessment')}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status de Recrutamento</CardTitle>
                <CardDescription>Vagas por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
                <div className="mt-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => navigateToSection('recruitment-selection')}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Evaluation Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Avaliações de Desempenho</CardTitle>
              <CardDescription>Resultado das últimas avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
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
              </div>
              <div className="mt-2 text-center">
                <Button size="sm" variant="outline" onClick={() => navigateToSection('performance')}>
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-6">
          {/* Training Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinamentos Ativos</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Em andamento
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Treinamento</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <p className="text-xs text-muted-foreground">
                  No mês atual
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 15.000</div>
                <p className="text-xs text-muted-foreground">
                  Utilizado: R$ 9.500
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Competências</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Principais áreas de capacitação
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Training Completion Status & Department Training Completion */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Treinamentos</CardTitle>
                <CardDescription>Distribuição por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
                <div className="mt-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => navigateToSection('training')}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Treinamento por Departamento</CardTitle>
                <CardDescription>Horas de treinamento por departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6">
          {/* Financial Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 281.500</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Médio</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 6.702</div>
                <p className="text-xs text-muted-foreground">
                  Por colaborador
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Benefícios</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 50.000</div>
                <p className="text-xs text-muted-foreground">
                  17,7% do custo total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Encargos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 66.000</div>
                <p className="text-xs text-muted-foreground">
                  23,4% do custo total
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Salary Market Comparison & Cost Trend */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo Salarial</CardTitle>
                <CardDescription>Comparação com mercado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
                <div className="mt-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => navigateToSection('salary')}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Evolução dos Custos de Pessoal</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                </div>
                <div className="mt-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => navigateToSection('employee-costs')}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
