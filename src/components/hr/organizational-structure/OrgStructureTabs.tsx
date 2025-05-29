
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrgStructureChart } from "./OrgStructureChart";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrgStructure } from "./OrgStructureProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function OrgStructureTabs() {
  const [activeView, setActiveView] = useState<"chart" | "summary">("chart");
  const navigate = useNavigate();
  const { positions, loading } = useOrgStructure();
  
  const handleViewJobPositions = () => {
    navigate("/human-resources", { state: { activeTab: "job-plan" } });
  };
  
  // Calculate summary statistics
  const summary = {
    totalPositions: positions.length,
    departments: [...new Set(positions.map(p => p.department))].length,
    seniorPositions: positions.filter(p => p.level === 'Senior').length,
    plenoPositions: positions.filter(p => p.level === 'Pleno').length,
    juniorPositions: positions.filter(p => p.level === 'Junior').length,
    departmentHeads: positions.filter(p => p.isDepartmentHead).length
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "chart" | "summary")}>
        <TabsList className="mb-4">
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organograma
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resumo
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <OrgStructureChart />
        </TabsContent>
        
        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Cargos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalPositions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Departamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.departments}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Responsáveis de Departamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.departmentHeads}</div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Nível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Senior</Badge>
                    <span className="font-semibold">{summary.seniorPositions}</span>
                    <span className="text-muted-foreground">cargos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pleno</Badge>
                    <span className="font-semibold">{summary.plenoPositions}</span>
                    <span className="text-muted-foreground">cargos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Junior</Badge>
                    <span className="font-semibold">{summary.juniorPositions}</span>
                    <span className="text-muted-foreground">cargos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {!loading && positions.length > 0 && (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Cargos por Departamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {[...new Set(positions.map(p => p.department))].map(dept => {
                      const deptPositions = positions.filter(p => p.department === dept);
                      return (
                        <div key={dept} className="flex justify-between items-center p-2 border rounded">
                          <span className="font-medium">{dept}</span>
                          <Badge variant="outline">{deptPositions.length}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleViewJobPositions}
        >
          <ExternalLink className="h-4 w-4" />
          Ver Lista Completa de Cargos
        </Button>
      </div>
    </div>
  );
}
