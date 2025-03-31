
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface MaturityThermometerProps {
  score: number;
  modulesCompletion: number;
  goalsAchievement: number;
}

export function MaturityThermometer({ 
  score = 0, 
  modulesCompletion = 0, 
  goalsAchievement = 0 
}: MaturityThermometerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Termômetro de Maturidade</h2>
          <p className="text-muted-foreground">
            Acompanhe o nível de maturidade dos processos de gestão de pessoas
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Nível de Maturidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl font-bold">{score}%</div>
            <Progress value={score} className="w-full h-4" />
            <div className="flex gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Básico (0-30%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Intermediário (31-70%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Avançado (71-100%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completude de Módulos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{modulesCompletion}%</div>
              <Progress value={modulesCompletion} className="flex-1 h-3" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Porcentagem dos módulos de RH implementados e em uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alcance de Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{goalsAchievement}%</div>
              <Progress value={goalsAchievement} className="flex-1 h-3" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Porcentagem de metas de RH alcançadas no período atual
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
