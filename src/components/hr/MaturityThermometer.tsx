
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, TrendingUp, Target, Users, BarChart } from "lucide-react";

interface MaturityCategory {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  description: string;
  color: string;
}

interface MaturityIndicator {
  id: string;
  category: string;
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

export function MaturityThermometer() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dados mock para demonstração
  const categories: MaturityCategory[] = [
    {
      id: "leadership",
      name: "Liderança",
      score: 75,
      maxScore: 100,
      description: "Capacidade de liderança e gestão de equipes",
      color: "bg-blue-500"
    },
    {
      id: "processes",
      name: "Processos",
      score: 82,
      maxScore: 100,
      description: "Maturidade dos processos organizacionais",
      color: "bg-green-500"
    },
    {
      id: "technology",
      name: "Tecnologia",
      score: 68,
      maxScore: 100,
      description: "Adoção e uso de tecnologias",
      color: "bg-purple-500"
    },
    {
      id: "culture",
      name: "Cultura",
      score: 90,
      maxScore: 100,
      description: "Cultura organizacional e engajamento",
      color: "bg-orange-500"
    },
    {
      id: "innovation",
      name: "Inovação",
      score: 65,
      maxScore: 100,
      description: "Capacidade de inovação e adaptação",
      color: "bg-red-500"
    }
  ];

  const indicators: MaturityIndicator[] = [
    {
      id: "1",
      category: "leadership",
      name: "Feedback Regular",
      current: 78,
      target: 85,
      trend: 'up'
    },
    {
      id: "2",
      category: "leadership",
      name: "Desenvolvimento de Talentos",
      current: 72,
      target: 80,
      trend: 'up'
    },
    {
      id: "3",
      category: "processes",
      name: "Documentação de Processos",
      current: 85,
      target: 90,
      trend: 'stable'
    },
    {
      id: "4",
      category: "processes",
      name: "Automação",
      current: 79,
      target: 85,
      trend: 'up'
    },
    {
      id: "5",
      category: "technology",
      name: "Ferramentas Digitais",
      current: 70,
      target: 85,
      trend: 'up'
    },
    {
      id: "6",
      category: "culture",
      name: "Engajamento dos Funcionários",
      current: 88,
      target: 90,
      trend: 'stable'
    }
  ];

  const overallScore = Math.round(categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length);

  const getMaturityLevel = (score: number) => {
    if (score >= 90) return { level: "Excelente", color: "bg-green-100 text-green-800", description: "Organização madura" };
    if (score >= 75) return { level: "Bom", color: "bg-blue-100 text-blue-800", description: "Em desenvolvimento" };
    if (score >= 60) return { level: "Regular", color: "bg-yellow-100 text-yellow-800", description: "Precisa melhorar" };
    return { level: "Baixo", color: "bg-red-100 text-red-800", description: "Ação urgente" };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const maturityLevel = getMaturityLevel(overallScore);

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Termômetro de Maturidade Organizacional</h2>
          <p className="text-muted-foreground">Avaliação da maturidade organizacional em diferentes dimensões</p>
        </div>
        <Button>
          <BarChart className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
      </div>

      {/* Score Geral */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Thermometer className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl">Score de Maturidade Geral</CardTitle>
          </div>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {overallScore}%
          </div>
          <Badge className={maturityLevel.color}>
            {maturityLevel.level} - {maturityLevel.description}
          </Badge>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="h-6" />
        </CardContent>
      </Card>

      {/* Categorias de Maturidade */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {category.name}
                <Badge variant="outline">{category.score}%</Badge>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={category.score} className="h-4 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Indicadores Detalhados */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle>
              Indicadores - {categories.find(c => c.id === selectedCategory)?.name}
            </CardTitle>
            <CardDescription>
              Métricas específicas para esta categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indicators
                .filter(indicator => indicator.category === selectedCategory)
                .map((indicator) => (
                  <div key={indicator.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{indicator.name}</h4>
                        {getTrendIcon(indicator.trend)}
                      </div>
                      <Progress value={indicator.current} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Atual: {indicator.current}%</span>
                        <span>Meta: {indicator.target}%</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant="outline">
                        {indicator.current}%
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Resumidas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Categorias Avaliadas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Em Melhoria
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {indicators.filter(i => i.trend === 'up').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Acima da Meta
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {indicators.filter(i => i.current >= i.target).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
                Score Médio
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallScore}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
