
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrialEvaluationWithEmployee, EvaluationCriterion } from "@/services/trialEvaluationService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface TrialEvaluationComparisonProps {
  evaluations: TrialEvaluationWithEmployee[];
  criteria: EvaluationCriterion[];
}

export function TrialEvaluationComparison({ evaluations, criteria }: TrialEvaluationComparisonProps) {
  if (evaluations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Nenhuma avaliação encontrada para comparação.</p>
        </CardContent>
      </Card>
    );
  }

  const employee = evaluations[0].employee;

  // Preparar dados para gráficos
  const evolutionData = evaluations.map(eval => {
    const criteriaScores = eval.evaluation_criteria_scores || {};
    const scoresArray = Object.values(criteriaScores).filter(score => typeof score === 'number') as number[];
    const average = scoresArray.length > 0 ? scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length : 0;
    
    return {
      period: `${eval.evaluation_period_number}º Período`,
      average: Number(average.toFixed(1)),
      date: new Date(eval.evaluation_date).toLocaleDateString('pt-BR'),
      decision: eval.final_decision
    };
  });

  // Comparação por critério
  const criteriaComparison = criteria.map(criterion => {
    const scores = evaluations.map(eval => ({
      period: `${eval.evaluation_period_number}º`,
      score: eval.evaluation_criteria_scores?.[criterion.name] || 0
    }));

    return {
      name: criterion.name,
      scores
    };
  });

  const getDecisionBadge = (decision: string | null) => {
    if (!decision) return <Badge variant="outline">Pendente</Badge>;
    
    switch (decision) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Não Aprovado</Badge>;
      case 'extended':
        return <Badge className="bg-yellow-100 text-yellow-800">Prorrogado</Badge>;
      default:
        return <Badge variant="outline">{decision}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com informações do funcionário */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Avaliações - {employee.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cargo</p>
              <p className="text-sm">{employee.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departamento</p>
              <p className="text-sm">{employee.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Admissão</p>
              <p className="text-sm">{new Date(employee.hire_date).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Setor</p>
              <p className="text-sm">{employee.sector || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evolução das Médias */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução das Médias por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resumo das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluations.map((evaluation, index) => (
              <div key={evaluation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">
                      {evaluation.evaluation_period_number}º Período de Avaliação
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(evaluation.evaluation_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {getDecisionBadge(evaluation.final_decision)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                    <p className="text-2xl font-bold">
                      {evolutionData[index]?.average || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avaliador</p>
                    <p className="text-sm">{evaluation.evaluator?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Superior Imediato</p>
                    <p className="text-sm">{evaluation.immediate_supervisor_name || 'Não informado'}</p>
                  </div>
                </div>

                {evaluation.decision_justification && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-muted-foreground">Justificativa</p>
                    <p className="text-sm">{evaluation.decision_justification}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparação por Critério */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução por Critério</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {criteriaComparison.map((criterion) => (
              <div key={criterion.name} className="space-y-2">
                <h4 className="font-medium">{criterion.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {criterion.scores.map((score, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{score.period}</span>
                        <span>{score.score}/4</span>
                      </div>
                      <Progress value={(score.score / 4) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
