
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  AlertCircle, 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  CircleUser, 
  Clipboard, 
  ClipboardEdit, 
  Download, 
  EyeIcon, 
  Plus, 
  Smile
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClimateResearch() {
  // Mock data for climate surveys
  const [surveys] = useState([
    {
      id: "s1",
      title: "Pesquisa de Clima Organizacional - 2023",
      startDate: "2023-08-01",
      endDate: "2023-08-15",
      status: "completed",
      participation: 85,
      categories: {
        leadership: 7.8,
        workEnvironment: 8.2,
        compensation: 6.5,
        careerDevelopment: 7.0,
        workLifeBalance: 7.5,
        communication: 6.8
      },
      eSat: 7.5
    },
    {
      id: "s2",
      title: "Pesquisa de Clima Organizacional - 2022",
      startDate: "2022-08-01",
      endDate: "2022-08-15",
      status: "completed",
      participation: 78,
      categories: {
        leadership: 7.5,
        workEnvironment: 7.8,
        compensation: 6.3,
        careerDevelopment: 6.8,
        workLifeBalance: 7.2,
        communication: 6.5
      },
      eSat: 7.2
    },
    {
      id: "s3",
      title: "Pulso - Outubro 2023",
      startDate: "2023-10-01",
      endDate: "2023-10-05",
      status: "active",
      participation: 45,
      categories: null,
      eSat: null
    }
  ]);

  // Line chart data for trends
  const trendData = [
    {
      name: '2021',
      eSat: 7.0,
      leadership: 7.2,
      workEnvironment: 7.5,
      compensation: 6.0
    },
    {
      name: '2022',
      eSat: 7.2,
      leadership: 7.5,
      workEnvironment: 7.8,
      compensation: 6.3
    },
    {
      name: '2023',
      eSat: 7.5,
      leadership: 7.8,
      workEnvironment: 8.2,
      compensation: 6.5
    },
  ];

  // Radar chart data
  const radarData = [
    { category: 'Liderança', value: 7.8, fullMark: 10 },
    { category: 'Ambiente', value: 8.2, fullMark: 10 },
    { category: 'Remuneração', value: 6.5, fullMark: 10 },
    { category: 'Carreira', value: 7.0, fullMark: 10 },
    { category: 'Equilíbrio', value: 7.5, fullMark: 10 },
    { category: 'Comunicação', value: 6.8, fullMark: 10 },
  ];

  // Pie chart data for sentiment
  const sentimentData = [
    { name: 'Positivo', value: 65 },
    { name: 'Neutro', value: 25 },
    { name: 'Negativo', value: 10 }
  ];

  const COLORS = ['#4ade80', '#94a3b8', '#f87171'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativa</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Concluída</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Rascunho</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getParticipationColorClass = (participation: number) => {
    if (participation >= 80) return "text-green-600";
    if (participation >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Pesquisa de Clima Organizacional</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pesquisa
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Smile className="h-4 w-4 mr-2" />
                e-Sat Atual
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5</div>
            <div className="text-xs text-green-600">+0.3 vs último ano</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CircleUser className="h-4 w-4 mr-2" />
                Participação
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs text-green-600">+7% vs último ano</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Melhor Categoria
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ambiente</div>
            <div className="text-xs text-muted-foreground">8.2 / 10</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Área de Atenção
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Remuneração</div>
            <div className="text-xs text-muted-foreground">6.5 / 10</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="surveys">Pesquisas</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="action-plan">Plano de Ação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resultado por Categoria</CardTitle>
                <CardDescription>Pesquisa de Clima Organizacional - 2023</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Pontuação"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análise de Sentimento</CardTitle>
                <CardDescription>Baseada nos comentários abertos</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Comparação Histórica</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="eSat" stroke="#6366f1" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="leadership" stroke="#4ade80" />
                  <Line type="monotone" dataKey="workEnvironment" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="compensation" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Principais Comentários</h3>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    "A comunicação entre departamentos poderia melhorar. Às vezes nos sentimos isolados das decisões que afetam nosso trabalho."
                  </blockquote>
                  <p className="text-sm text-muted-foreground mt-2">Departamento de Marketing</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    "O ambiente de trabalho é excelente e os líderes são bastante acessíveis. Me sinto valorizado e parte de um time."
                  </blockquote>
                  <p className="text-sm text-muted-foreground mt-2">Departamento de Tecnologia</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    "Gostaria de ver mais oportunidades de crescimento e desenvolvimento de carreira dentro da empresa."
                  </blockquote>
                  <p className="text-sm text-muted-foreground mt-2">Departamento de Operações</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="surveys" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {surveys.map(survey => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{survey.title}</CardTitle>
                    {getStatusBadge(survey.status)}
                  </div>
                  <CardDescription>
                    {new Date(survey.startDate).toLocaleDateString('pt-BR')} a {new Date(survey.endDate).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Participação</span>
                        <span className={getParticipationColorClass(survey.participation)}>
                          {survey.participation}%
                        </span>
                      </div>
                      <Progress value={survey.participation} className="h-2" />
                    </div>
                    
                    {survey.eSat && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">e-Sat</span>
                        <span className="font-bold text-lg">{survey.eSat}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pesquisas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {item.name}
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="h-1 bg-primary"></div>
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      <div>
                        <p className="font-medium">Pesquisa de Clima {item.name}</p>
                        <p className="text-sm text-muted-foreground">e-Sat: {item.eSat}</p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do e-Sat</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="eSat" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Liderança</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="leadership" stroke="#4ade80" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ambiente de Trabalho</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="workEnvironment" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Remuneração</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="compensation" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Participação</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: '2021', value: 72 },
                    { name: '2022', value: 78 },
                    { name: '2023', value: 85 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" name="Participação (%)" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="action-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano de Ação - Pesquisa 2023</CardTitle>
              <CardDescription>Baseado nos resultados da última pesquisa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border p-4 rounded-md">
                  <h4 className="font-semibold flex items-center">
                    <ClipboardEdit className="h-4 w-4 mr-2" />
                    Melhoria na Comunicação Interna
                  </h4>
                  <p className="text-sm mt-2">Implementar canais de comunicação mais eficientes entre departamentos e aumentar a frequência de atualizações corporativas.</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Responsável:</span> Depto. RH
                    </div>
                    <Badge>Em Andamento</Badge>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="font-semibold flex items-center">
                    <ClipboardEdit className="h-4 w-4 mr-2" />
                    Revisão do Plano de Carreira
                  </h4>
                  <p className="text-sm mt-2">Desenvolver e comunicar planos de carreira mais claros, com critérios objetivos de promoção e crescimento profissional.</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Responsável:</span> Depto. RH e Gestores
                    </div>
                    <Badge>Planejado</Badge>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="font-semibold flex items-center">
                    <ClipboardEdit className="h-4 w-4 mr-2" />
                    Programa de Reconhecimento
                  </h4>
                  <p className="text-sm mt-2">Criar um programa formal de reconhecimento para valorizar contribuições extraordinárias dos colaboradores.</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Responsável:</span> Depto. RH
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="font-semibold flex items-center">
                    <ClipboardEdit className="h-4 w-4 mr-2" />
                    Estudo de Mercado - Remuneração
                  </h4>
                  <p className="text-sm mt-2">Realizar estudo comparativo de mercado para ajustar a política de remuneração e benefícios da empresa.</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Responsável:</span> Depto. RH e Financeiro
                    </div>
                    <Badge>Planejado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ação
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
