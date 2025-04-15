
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getSurveyResponses } from "@/services/climateSurveyService";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SurveyResultsProps {
  surveyId: string;
  title: string;
  questions: any[];
}

export function SurveyResults({ surveyId, title, questions }: SurveyResultsProps) {
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  
  // Categorias disponíveis
  const categories = [
    { value: "all", label: "Todas as categorias" },
    { value: "geral", label: "Geral" },
    { value: "lideranca", label: "Liderança" },
    { value: "comunicacao", label: "Comunicação" },
    { value: "ambiente", label: "Ambiente de Trabalho" },
    { value: "desenvolvimento", label: "Desenvolvimento Profissional" },
    { value: "reconhecimento", label: "Reconhecimento e Recompensa" },
    { value: "trabalho_equipe", label: "Trabalho em Equipe" },
    { value: "bem_estar", label: "Bem-estar" }
  ];
  
  // Filtros de tempo
  const timeFilters = [
    { value: "all", label: "Todo o período" },
    { value: "month", label: "Último mês" },
    { value: "quarter", label: "Último trimestre" },
    { value: "year", label: "Último ano" }
  ];
  
  // Buscar as respostas no carregamento e quando o ID da pesquisa mudar
  useEffect(() => {
    const fetchResponses = async () => {
      setIsLoading(true);
      try {
        const data = await getSurveyResponses(surveyId);
        setResponses(data);
      } catch (error) {
        console.error("Erro ao carregar respostas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResponses();
  }, [surveyId]);
  
  // Filtrar perguntas por categoria
  const filteredQuestions = questions.filter(q => 
    selectedCategory === "all" || q.category === selectedCategory
  );
  
  // Calcular média de uma pergunta específica da escala 1-5
  const calculateQuestionAverage = (questionId: string) => {
    // Filtrar respostas por data se necessário
    let filteredResponses = responses;
    
    if (filter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (filter === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (filter === "quarter") {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (filter === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredResponses = responses.filter(response => {
        return new Date(response.submitted_at) >= cutoffDate;
      });
    }
    
    // Obter valores numéricos das respostas (apenas para perguntas de escala)
    const values = filteredResponses
      .map(response => response.responses[questionId])
      .filter(value => typeof value === "number");
    
    if (values.length === 0) return 0;
    
    // Calcular média
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return sum / values.length;
  };
  
  // Calcular distribuição de respostas para uma pergunta específica
  const calculateDistribution = (questionId: string) => {
    // Filtrar respostas por data se necessário
    let filteredResponses = responses;
    
    if (filter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (filter === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (filter === "quarter") {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (filter === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredResponses = responses.filter(response => {
        return new Date(response.submitted_at) >= cutoffDate;
      });
    }
    
    // Inicializar contagem para cada valor da escala
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    // Contar ocorrências de cada valor
    filteredResponses.forEach(response => {
      const value = response.responses[questionId];
      if (typeof value === "number" && value >= 1 && value <= 5) {
        distribution[value]++;
      }
    });
    
    // Calcular percentagens
    const total = Object.values(distribution).reduce((acc: number, curr: number) => acc + curr, 0);
    
    return [1, 2, 3, 4, 5].map(value => ({
      name: `${value} ${value === 1 ? 'estrela' : 'estrelas'}`,
      value: distribution[value],
      percentage: total > 0 ? Math.round((distribution[value] / total) * 100) : 0
    }));
  };
  
  // Preparar dados para o gráfico de barras com todas as perguntas
  const prepareChartData = () => {
    return filteredQuestions
      .filter(question => question.question_type === "scale")
      .map(question => ({
        name: question.question.length > 30 
          ? question.question.substring(0, 30) + "..." 
          : question.question,
        average: calculateQuestionAverage(question.id),
        fullQuestion: question.question,
        id: question.id
      }));
  };
  
  // Voltar para a página anterior
  const handleBack = () => {
    navigate(`/human-resources?activeTab=climate&survey=${surveyId}`);
  };
  
  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Renderizar durante carregamento
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a pesquisa
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              {timeFilters.map(filter => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {responses.length > 0 ? 
                `Última resposta em ${format(new Date(responses[0].submitted_at), "dd/MM/yyyy", { locale: ptBR })}` : 
                "Nenhuma resposta recebida"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredQuestions
                .filter(q => q.question_type === "scale")
                .map(q => calculateQuestionAverage(q.id))
                .reduce((acc, curr, _, arr) => acc + curr / arr.length, 0)
                .toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Escala de 1 a 5
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Perguntas Avaliadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredQuestions.filter(q => q.question_type === "scale").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De um total de {questions.length} perguntas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {filteredQuestions.filter(q => q.question_type === "scale").length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Médias por Pergunta</CardTitle>
              <CardDescription>
                Médias das avaliações (escala de 1 a 5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip 
                      formatter={(value: any) => [value.toFixed(1), "Média"]}
                      labelFormatter={(label: string, payload: any[]) => {
                        if (payload.length > 0) {
                          return payload[0].payload.fullQuestion;
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="average" name="Média" fill="#8884d8">
                      {prepareChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Seção para cada pergunta individual */}
          <div className="space-y-6">
            {filteredQuestions
              .filter(question => question.question_type === "scale")
              .map(question => {
                const average = calculateQuestionAverage(question.id);
                const distribution = calculateDistribution(question.id);
                
                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                      <CardDescription>
                        Média: {average.toFixed(1)} de 5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={distribution}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: any, name: string, props: any) => {
                                return [`${value} (${props.payload.percentage}%)`, "Respostas"];
                              }}
                            />
                            <Legend />
                            <Bar dataKey="value" name="Respostas" fill="#8884d8">
                              {distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {responses.length === 0 ? 
                "Ainda não há respostas para esta pesquisa." : 
                "Não há perguntas de escala para analisar na categoria selecionada."}
            </p>
            {responses.length === 0 && (
              <Button variant="outline">Ver todas as categorias</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
