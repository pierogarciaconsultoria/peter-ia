
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, FileSpreadsheet } from "lucide-react";

export function NonConformityStats() {
  const stats = [
    {
      title: "Total de Não Conformidades",
      value: 38,
      description: "Registros no período",
      icon: FileSpreadsheet,
      color: "text-blue-500",
    },
    {
      title: "Em Aberto",
      value: 12,
      description: "Aguardando análise",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Em Andamento",
      value: 18,
      description: "Com ações definidas",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Encerradas",
      value: 8,
      description: "Eficácia verificada",
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
