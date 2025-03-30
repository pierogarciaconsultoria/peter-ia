
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecruitmentMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">3 posições em aberto</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Candidatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">39</div>
          <p className="text-xs text-muted-foreground">12 novos esta semana</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Entrevistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
        </CardContent>
      </Card>
    </div>
  );
}
