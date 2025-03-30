
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDepartments } from "@/hooks/useDepartments";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DepartmentOrgChart } from "../DepartmentOrgChart";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  level: string;
  parentPosition?: string | null;
}

export function DepartmentOrgStructure() {
  const [activeView, setActiveView] = useState<"chart" | "list">("chart");
  const { departments } = useDepartments();

  // Sample positions based on departments (in a real app, these would come from an API)
  const generatePositionsFromDepartments = (): JobPosition[] => {
    const positions: JobPosition[] = [];
    
    departments.forEach((dept) => {
      // Add department head
      positions.push({
        id: `head-${dept.id}`,
        title: `Gerente de ${dept.name}`,
        department: dept.name,
        level: "Senior"
      });
      
      // Add other positions
      if (dept.name === "Produção" || dept.name === "Manutenção" || dept.name === "Logística") {
        positions.push({
          id: `supervisor-${dept.id}`,
          title: `Supervisor de ${dept.name}`,
          department: dept.name,
          level: "Pleno"
        });
        
        positions.push({
          id: `analyst-${dept.id}`,
          title: `Analista de ${dept.name}`,
          department: dept.name,
          level: "Junior"
        });
      } else {
        positions.push({
          id: `coordinator-${dept.id}`,
          title: `Coordenador de ${dept.name}`,
          department: dept.name,
          level: "Pleno"
        });
        
        positions.push({
          id: `analyst-${dept.id}`,
          title: `Analista de ${dept.name}`,
          department: dept.name,
          level: "Junior"
        });
      }
    });
    
    return positions;
  };

  // If there are no departments, we'll show default positions for demonstration
  const getDemoPositions = (): JobPosition[] => {
    return [
      { id: "1", title: "Gerente de Produção", department: "Produção", level: "Senior" },
      { id: "2", title: "Supervisor de Produção", department: "Produção", level: "Pleno" },
      { id: "3", title: "Analista de Produção", department: "Produção", level: "Junior" },
      { id: "4", title: "Gerente de Qualidade", department: "Qualidade", level: "Senior" },
      { id: "5", title: "Analista de Qualidade", department: "Qualidade", level: "Junior" },
      { id: "6", title: "Gerente de RH", department: "Recursos Humanos", level: "Senior" },
      { id: "7", title: "Analista de RH", department: "Recursos Humanos", level: "Junior" }
    ];
  };
  
  const positions = departments.length > 0 ? generatePositionsFromDepartments() : getDemoPositions();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Estrutura Organizacional</CardTitle>
        <CardDescription>
          Visualize como os departamentos se relacionam na estrutura da empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "chart" | "list")}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Organograma</TabsTrigger>
            <TabsTrigger value="list">Lista de Cargos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <DepartmentOrgChart positions={positions} />
          </TabsContent>
          
          <TabsContent value="list">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Nível</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.title}</TableCell>
                      <TableCell>{position.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{position.level}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
