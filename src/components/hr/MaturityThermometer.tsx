
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MaturityThermometer() {
  // Mock data para demonstração
  const maturityAreas = [
    {
      area: "Gestão de Pessoas",
      score: 85,
      trend: "up",
      description: "Processos de RH bem estruturados",
      level: "Avançado"
    },
    {
      area: "Processos e Procedimentos",
      score: 72,
      trend: "up",
      description: "Documentação em desenvolvimento",
      level: "Intermediário"
    },
    {
      area: "Tecnologia e Inovação",
      score: 68,
      trend: "stable",
      description: "Ferramentas básicas implementadas",
      level: "Intermediário"
    },
    {
      area: "Cultura Organizacional",
      score: 91,
      trend: "up",
      description: "Cultura forte e bem definida",
      level: "Avançado"
    },
    {
      area: "Gestão Financeira",
      score: 76,
      trend: "down",
      description: "Controles financeiros adequados",
      level: "Intermediário"
    },
    {
      area: "Qualidade e Excelência",
      score: 64,
      trend: "up",
      description: "Implementando padrões de qualidade",
      level: "Básico"
    }
  ];

  const overallScore = Math.round(maturityAreas.reduce((sum, area) => sum + area.score, 0) / maturityAreas.length);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      "Avançado": "bg-green-100 text-green-800",
      "Intermediário": "bg-yellow-100 text-yellow-800",
      "Básico": "bg-red-100 text-red-800"
    };
    
    return (
      <Badge variant="outline" className={variants[level as keyof typeof variants]}>
        {level}
      </Badge>
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Termômetro de Maturidade</h2>
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Última atualização: hoje</span>
        </div>
      </div>

      {/* Score Geral */}
      <Card className={`${getScoreBackground(overallScore)} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Maturidade Geral da Organização</span>
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={overallScore} 
              className="h-3"
            />
            <p className="text-sm text-muted-foreground">
              Sua organização está no nível {overallScore >= 80 ? "Avançado" : overallScore >= 60 ? "Intermediário" : "Básico"} de maturidade organizacional
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Áreas de Maturidade */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {maturityAreas.map((area, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{area.area}</CardTitle>
                {getTrendIcon(area.trend)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getScoreColor(area.score)}`}>
                  {area.score}%
                </span>
                {getLevelBadge(area.level)}
              </div>
              
              <Progress 
                value={area.score} 
                className="h-2"
              />
              
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações para Melhoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-red-700">Áreas que Precisam de Atenção</h4>
              <ul className="space-y-1 text-sm">
                {maturityAreas
                  .filter(area => area.score < 70)
                  .map((area, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {area.area} ({area.score}%)
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Pontos Fortes</h4>
              <ul className="space-y-1 text-sm">
                {maturityAreas
                  .filter(area => area.score >= 80)
                  .map((area, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {area.area} ({area.score}%)
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
