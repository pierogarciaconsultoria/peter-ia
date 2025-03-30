
import { useMemo } from "react";
import { DiscAssessment } from "@/hooks/useDiscAssessments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

interface DiscAssessmentStatsProps {
  assessments: DiscAssessment[];
}

export function DiscAssessmentStats({ assessments }: DiscAssessmentStatsProps) {
  const primaryTypeCounts = useMemo(() => {
    const counts = { D: 0, I: 0, S: 0, C: 0 };
    
    assessments.forEach(assessment => {
      counts[assessment.primary_type] += 1;
    });
    
    return [
      { name: "Dominante", value: counts.D, color: "#ef4444" },
      { name: "Influente", value: counts.I, color: "#eab308" },
      { name: "Estável", value: counts.S, color: "#22c55e" },
      { name: "Conformista", value: counts.C, color: "#3b82f6" }
    ];
  }, [assessments]);
  
  const averageScores = useMemo(() => {
    if (assessments.length === 0) return { D: 0, I: 0, S: 0, C: 0 };
    
    const totals = { D: 0, I: 0, S: 0, C: 0 };
    
    assessments.forEach(assessment => {
      totals.D += assessment.scores.D;
      totals.I += assessment.scores.I;
      totals.S += assessment.scores.S;
      totals.C += assessment.scores.C;
    });
    
    return [
      { name: "D", value: totals.D / assessments.length, color: "#ef4444" },
      { name: "I", value: totals.I / assessments.length, color: "#eab308" },
      { name: "S", value: totals.S / assessments.length, color: "#22c55e" },
      { name: "C", value: totals.C / assessments.length, color: "#3b82f6" }
    ];
  }, [assessments]);
  
  if (assessments.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Perfis Primários</CardTitle>
          <CardDescription>
            Número de avaliações por perfil DISC primário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={primaryTypeCounts}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {primaryTypeCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} pessoa(s)`, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Médias de Pontuação</CardTitle>
          <CardDescription>
            Pontuações médias em cada dimensão DISC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={averageScores}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(1)} pontos`, 'Média']} />
                <Bar dataKey="value">
                  {averageScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
