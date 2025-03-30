
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MaturityLevel {
  name: string;
  minScore: number;
  color: string;
  description: string;
}

interface MaturityThermometerProps {
  score: number;
  modulesCompletion: {
    module: string;
    completion: number;
    weight: number;
  }[];
  goalsAchievement: number;
}

export function MaturityThermometer({ 
  score, 
  modulesCompletion,
  goalsAchievement 
}: MaturityThermometerProps) {
  // Define maturity levels
  const maturityLevels: MaturityLevel[] = [
    { name: "Inicial", minScore: 0, color: "bg-red-500", description: "Processos básicos implementados" },
    { name: "Em Desenvolvimento", minScore: 30, color: "bg-orange-500", description: "Processos estruturados e documentados" },
    { name: "Estabelecido", minScore: 50, color: "bg-yellow-500", description: "Processos bem definidos e mensurados" },
    { name: "Gerenciado", minScore: 70, color: "bg-blue-500", description: "Processos otimizados e integrados" },
    { name: "Otimizado", minScore: 90, color: "bg-green-500", description: "Melhoria contínua e inovação" }
  ];

  // Find current level
  const currentLevel = maturityLevels
    .filter(level => score >= level.minScore)
    .pop();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Termômetro de Maturidade
        </CardTitle>
        <CardDescription>
          Nível atual: <span className="font-medium">{currentLevel?.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Thermometer visualization */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{score}%</span>
            <div className="flex-1">
              <Progress value={score} className="h-3" 
                style={{
                  background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #3b82f6, #22c55e)"
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            {maturityLevels.map(level => (
              <TooltipProvider key={level.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`h-3 w-3 rounded-full ${level.color} ${score >= level.minScore ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p><strong>{level.name}</strong> ({level.minScore}%+)</p>
                    <p className="text-xs">{level.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Modules completion */}
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium">Principais fatores:</h4>
          <div className="text-xs space-y-1">
            {modulesCompletion.map(module => (
              <div key={module.module} className="flex justify-between items-center">
                <span>{module.module}</span>
                <span className="font-medium">{module.completion}%</span>
              </div>
            ))}
            <div className="flex justify-between items-center font-medium pt-1 border-t">
              <span>Atingimento de Metas</span>
              <span>{goalsAchievement}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
