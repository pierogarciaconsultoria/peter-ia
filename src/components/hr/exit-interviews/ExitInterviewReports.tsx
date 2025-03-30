
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";

// Map exit reasons to more readable labels
const reasonLabels: Record<string, string> = {
  proposta_melhor: "Proposta melhor",
  mudanca_carreira: "Mudança de carreira",
  realocacao: "Realocação",
  motivos_pessoais: "Motivos pessoais",
  ambiente_trabalho: "Ambiente de trabalho",
  lideranca: "Problemas com liderança",
  salario_beneficios: "Salário/benefícios",
  formacao_academica: "Formação acadêmica",
  demissao_empresa: "Decisão da empresa",
  outro: "Outro",
};

interface ExitInterview {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  exitDate: Date;
  reason: string;
  status: string;
  feedback?: string;
  overallExperience?: string;
  wouldRecommend?: string;
  improvementSuggestions?: string;
}

interface ExitInterviewStatistic {
  name: string;
  count: number;
  percentage: number;
}

interface ExitInterviewReportsProps {
  interviews: ExitInterview[];
}

export function ExitInterviewReports({ interviews }: ExitInterviewReportsProps) {
  // Calculate statistics
  const calculateStatistics = () => {
    if (!interviews.length) return [];
    
    // Count reasons
    const reasonCounts: Record<string, number> = {};
    interviews.forEach(interview => {
      if (!reasonCounts[interview.reason]) {
        reasonCounts[interview.reason] = 0;
      }
      reasonCounts[interview.reason]++;
    });
    
    // Convert to statistics array
    return Object.keys(reasonCounts).map(reason => {
      const count = reasonCounts[reason];
      return {
        name: reasonLabels[reason] || reason,
        count,
        percentage: Math.round((count / interviews.length) * 100),
      };
    }).sort((a, b) => b.count - a.count);
  };

  const calculateDepartmentStatistics = () => {
    if (!interviews.length) return [];
    
    const deptCounts: Record<string, number> = {};
    interviews.forEach(interview => {
      if (!deptCounts[interview.department]) {
        deptCounts[interview.department] = 0;
      }
      deptCounts[interview.department]++;
    });
    
    return Object.keys(deptCounts).map(dept => {
      const count = deptCounts[dept];
      return {
        name: dept,
        count,
        percentage: Math.round((count / interviews.length) * 100),
      };
    }).sort((a, b) => b.count - a.count);
  };
  
  const reasonStats = calculateStatistics();
  const departmentStats = calculateDepartmentStatistics();
  
  // Calculate satisfaction metrics
  const getOverallExperienceStats = () => {
    const experienceCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    
    interviews.forEach(interview => {
      if (!interview.overallExperience) return;
      
      if (['excelente', 'boa'].includes(interview.overallExperience)) {
        experienceCounts.positive++;
      } else if (interview.overallExperience === 'neutra') {
        experienceCounts.neutral++;
      } else {
        experienceCounts.negative++;
      }
    });
    
    const total = interviews.length;
    return {
      positive: {
        count: experienceCounts.positive,
        percentage: Math.round((experienceCounts.positive / total) * 100) || 0,
      },
      neutral: {
        count: experienceCounts.neutral,
        percentage: Math.round((experienceCounts.neutral / total) * 100) || 0,
      },
      negative: {
        count: experienceCounts.negative,
        percentage: Math.round((experienceCounts.negative / total) * 100) || 0,
      },
    };
  };
  
  const experienceStats = getOverallExperienceStats();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Relatórios de Desligamento</h2>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Relatório Completo
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Índice de Satisfação
            </CardTitle>
            <CardDescription>
              Avaliação geral da experiência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-2xl font-bold">{experienceStats.positive.percentage}%</div>
                <p className="text-xs text-muted-foreground">Experiência positiva</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                {experienceStats.positive.count}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Positiva</span>
                <span>{experienceStats.positive.percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${experienceStats.positive.percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span>Neutra</span>
                <span>{experienceStats.neutral.percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: `${experienceStats.neutral.percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span>Negativa</span>
                <span>{experienceStats.negative.percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${experienceStats.negative.percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Principais Motivos de Saída
            </CardTitle>
            <CardDescription>
              Top 5 motivos de desligamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reasonStats.slice(0, 5).map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stat.name}</span>
                    <span>{stat.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {reasonStats.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Desligamentos por Departamento
            </CardTitle>
            <CardDescription>
              Distribuição por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.slice(0, 5).map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stat.name}</span>
                    <span>{stat.count}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {departmentStats.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Comentários Recentes</CardTitle>
          <CardDescription>
            Feedback dos funcionários nas entrevistas de saída
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews
              .filter(interview => interview.feedback)
              .slice(0, 5)
              .map((interview, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{interview.employeeName}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(interview.exitDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {interview.department} • {interview.position}
                  </p>
                  <p className="mt-2 text-sm">{interview.feedback}</p>
                </div>
              ))}
              
            {interviews.filter(interview => interview.feedback).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum comentário disponível
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
