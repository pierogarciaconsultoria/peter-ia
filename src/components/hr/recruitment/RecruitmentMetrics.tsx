
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartments } from "@/hooks/useDepartments";

export function RecruitmentMetrics() {
  const { departments, isLoading } = useDepartments();

  // Find departments with the highest headcount difference
  const departmentsWithHeadcountInfo = departments
    .filter(dept => dept.approved_headcount !== undefined && dept.current_headcount !== undefined)
    .sort((a, b) => {
      const diffA = (a.approved_headcount || 0) - (a.current_headcount || 0);
      const diffB = (b.approved_headcount || 0) - (b.current_headcount || 0);
      return diffB - diffA; // Sort by biggest gap first
    })
    .slice(0, 1); // Get the department with the biggest gap

  const topDeptWithGap = departmentsWithHeadcountInfo[0];
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      
      {/* New card for departmental headcount */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Quadro de Pessoal</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-xs text-muted-foreground">Carregando...</div>
          ) : topDeptWithGap ? (
            <>
              <div className="text-2xl font-bold">
                {topDeptWithGap.current_headcount}/{topDeptWithGap.approved_headcount}
              </div>
              <p className="text-xs text-muted-foreground">
                {topDeptWithGap.name}: {topDeptWithGap.approved_headcount - topDeptWithGap.current_headcount} vagas abertas
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">0/0</div>
              <p className="text-xs text-muted-foreground">
                Nenhum dado de quadro disponível
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
