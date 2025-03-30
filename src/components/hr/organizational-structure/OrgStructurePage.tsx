
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OrgStructureProvider } from "./OrgStructureProvider";
import { OrgStructureTabs } from "./OrgStructureTabs";

export function OrgStructurePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organograma</h2>
          <p className="text-muted-foreground">
            Estrutura organizacional da empresa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estrutura Organizacional</CardTitle>
          <CardDescription>
            Visualize como os departamentos e cargos se relacionam na estrutura da empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrgStructureProvider>
            <OrgStructureTabs />
          </OrgStructureProvider>
        </CardContent>
      </Card>
    </div>
  );
}
