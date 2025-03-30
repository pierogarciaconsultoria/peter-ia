
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DepartmentOrgChart } from "@/components/hr/DepartmentOrgChart";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDepartments } from "@/hooks/useDepartments";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  level: string;
  parentPosition?: string | null;
  isDepartmentHead?: boolean;
}

export function OrgStructurePage() {
  const [activeView, setActiveView] = useState<"chart" | "list">("chart");
  const { departments } = useDepartments();
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const { toast } = useToast();

  // Fetch job positions from the database
  useEffect(() => {
    async function fetchJobPositions() {
      try {
        const { data, error } = await supabase
          .from('job_positions')
          .select('*');
        
        if (error) throw error;

        // Map database positions to our format
        const formattedPositions: JobPosition[] = data.map(pos => ({
          id: pos.id,
          title: pos.title,
          department: pos.department,
          level: getPositionLevel(pos.title),
          parentPosition: pos.superior_position_id || null,
          isDepartmentHead: pos.is_department_head || false
        }));

        // Create hierarchy based on job titles and superior positions
        setPositions(formattedPositions);
      } catch (error) {
        console.error("Error fetching job positions:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do organograma.",
          variant: "destructive"
        });
        
        // Use departments to generate demo positions
        const generatedPositions = generatePositionsFromDepartments(departments);
        setPositions(generatedPositions);
      }
    }

    fetchJobPositions();
  }, [departments, toast]);

  // Determine position level based on title
  const getPositionLevel = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('gerente') || lowerTitle.includes('diretor')) {
      return 'Senior';
    } else if (lowerTitle.includes('coordenador') || lowerTitle.includes('supervisor')) {
      return 'Pleno';
    } else {
      return 'Junior';
    }
  };

  const generatePositionsFromDepartments = (departments: any[]): JobPosition[] => {
    const positions: JobPosition[] = [];
    
    departments.forEach((dept) => {
      positions.push({
        id: `head-${dept.id}`,
        title: `Gerente de ${dept.name}`,
        department: dept.name,
        level: "Senior",
        isDepartmentHead: true
      });
      
      if (dept.name === "Produção" || dept.name === "Manutenção" || dept.name === "Logística") {
        positions.push({
          id: `supervisor-${dept.id}`,
          title: `Supervisor de ${dept.name}`,
          department: dept.name,
          level: "Pleno",
          parentPosition: `head-${dept.id}`
        });
        
        positions.push({
          id: `analyst-${dept.id}`,
          title: `Analista de ${dept.name}`,
          department: dept.name,
          level: "Junior",
          parentPosition: `supervisor-${dept.id}`
        });
      } else {
        positions.push({
          id: `coordinator-${dept.id}`,
          title: `Coordenador de ${dept.name}`,
          department: dept.name,
          level: "Pleno",
          parentPosition: `head-${dept.id}`
        });
        
        positions.push({
          id: `analyst-${dept.id}`,
          title: `Analista de ${dept.name}`,
          department: dept.name,
          level: "Junior",
          parentPosition: `coordinator-${dept.id}`
        });
      }
    });
    
    return positions;
  };

  // Use demo positions if we have no real data
  const displayPositions = positions.length > 0 
    ? positions 
    : [
        { id: "1", title: "Gerente de Produção", department: "Produção", level: "Senior", isDepartmentHead: true },
        { id: "2", title: "Supervisor de Produção", department: "Produção", level: "Pleno", parentPosition: "1" },
        { id: "3", title: "Analista de Produção", department: "Produção", level: "Junior", parentPosition: "2" },
        { id: "4", title: "Gerente de Qualidade", department: "Qualidade", level: "Senior", isDepartmentHead: true },
        { id: "5", title: "Analista de Qualidade", department: "Qualidade", level: "Junior", parentPosition: "4" },
        { id: "6", title: "Gerente de RH", department: "Recursos Humanos", level: "Senior", isDepartmentHead: true },
        { id: "7", title: "Analista de RH", department: "Recursos Humanos", level: "Junior", parentPosition: "6" }
      ];

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
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "chart" | "list")}>
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Organograma</TabsTrigger>
              <TabsTrigger value="list">Lista de Cargos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <DepartmentOrgChart positions={displayPositions} />
            </TabsContent>
            
            <TabsContent value="list">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Responsável pelo Departamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayPositions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.title}</TableCell>
                        <TableCell>{position.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{position.level}</Badge>
                        </TableCell>
                        <TableCell>
                          {position.isDepartmentHead ? (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">Sim</Badge>
                          ) : (
                            <span className="text-muted-foreground">Não</span>
                          )}
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
    </div>
  );
}
