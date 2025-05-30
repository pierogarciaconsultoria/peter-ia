
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, LineChart, Plus, TrendingUp } from "lucide-react";
import { JobPosition } from "./types";
import { JobPositionTable } from "./job-salary/JobPositionTable";
import { JobPositionDialog } from "./job-salary/JobPositionDialog";
import { JobPositionDetailsDialog } from "./job-salary/JobPositionDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { SalaryComparisonChart } from "./job-salary/SalaryComparisonChart";
import { CareerPathView } from "./job-salary/CareerPathView";
import { DepartmentOrgChart } from "./DepartmentOrgChart";

export function JobSalaryPlan() {
  // Mock data for job positions with the new fields
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    {
      id: "job1",
      code: "DC-001",
      title: "Desenvolvedor Junior",
      department: "Tecnologia",
      description: "Desenvolvedor de software em início de carreira",
      revision: "1.0",
      approval_date: "2023-05-10",
      approver: "João Silva",
      immediate_supervisor_position: "Desenvolvedor Pleno",
      is_supervisor: false,
      cbo_code: "2124-05",
      norm: "NBR ISO 9001",
      main_responsibilities: "Desenvolvimento de aplicações web, manutenção de código, correção de bugs",
      education_requirements: "Formação em TI",
      skill_requirements: "JavaScript, HTML, CSS",
      training_requirements: "Git, Metodologias Ágeis",
      experience_requirements: "1+ anos de experiência",
      required_procedures: ["POP-DEV-001", "POP-DEV-002"],
      required_resources: ["Computador", "Monitor"],
      required_ppe: ["Não aplicável"],
      status: "approved"
    },
    {
      id: "job2",
      code: "DC-002",
      title: "Desenvolvedor Pleno",
      department: "Tecnologia",
      description: "Desenvolvedor de software com experiência intermediária",
      revision: "1.1",
      approval_date: "2023-05-15",
      approver: "Maria Oliveira",
      immediate_supervisor_position: "Desenvolvedor Senior",
      is_supervisor: true,
      cbo_code: "2124-05",
      norm: "NBR ISO 9001",
      main_responsibilities: "Desenvolvimento de funcionalidades complexas, revisão de código, mentoria de juniores",
      education_requirements: "Formação em TI",
      skill_requirements: "JavaScript, TypeScript, React, Node.js",
      training_requirements: "CI/CD, AWS",
      experience_requirements: "3+ anos de experiência",
      required_procedures: ["POP-DEV-001", "POP-DEV-002", "POP-DEV-003"],
      required_resources: ["Computador", "Monitor duplo"],
      required_ppe: ["Não aplicável"],
      status: "in_review"
    },
    {
      id: "job3",
      code: "DC-003",
      title: "Desenvolvedor Senior",
      department: "Tecnologia",
      description: "Desenvolvedor de software experiente",
      revision: "1.0",
      approval_date: "",
      approver: "",
      immediate_supervisor_position: "Tech Lead",
      is_supervisor: true,
      cbo_code: "2124-05",
      norm: "NBR ISO 9001",
      main_responsibilities: "Arquitetura de soluções, liderança técnica, decisões estratégicas",
      education_requirements: "Formação em TI",
      skill_requirements: "JavaScript, TypeScript, React, Node.js, Arquitetura de Software",
      training_requirements: "Liderança Técnica, DevOps",
      experience_requirements: "5+ anos de experiência",
      required_procedures: ["POP-DEV-001", "POP-DEV-002", "POP-DEV-003", "POP-DEV-004"],
      required_resources: ["Computador de alto desempenho", "Monitor duplo"],
      required_ppe: ["Não aplicável"],
      status: "draft"
    }
  ]);

  // State for dialogs
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJobPosition, setSelectedJobPosition] = useState<JobPosition | undefined>();
  const { toast } = useToast();

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Handle view details
  const handleViewDetails = (jobPosition: JobPosition) => {
    setSelectedJobPosition(jobPosition);
    setIsDetailsDialogOpen(true);
  };

  // Handle approve
  const handleApprove = (jobPosition: JobPosition) => {
    const updatedPositions = jobPositions.map(pos =>
      pos.id === jobPosition.id
        ? {
            ...pos,
            status: "approved" as const,
            approval_date: new Date().toISOString().split('T')[0],
            approver: "Usuário Atual" // Should be replaced with current user's name
          }
        : pos
    );
    setJobPositions(updatedPositions);
    toast({
      title: "Cargo aprovado",
      description: `O cargo ${jobPosition.title} foi aprovado com sucesso.`
    });
  };

  // Handle revise
  const handleRevise = (jobPosition: JobPosition) => {
    const updatedPositions = jobPositions.map(pos =>
      pos.id === jobPosition.id
        ? {
            ...pos,
            status: "in_review" as const,
            revision: (parseFloat(pos.revision) + 0.1).toFixed(1)
          }
        : pos
    );
    setJobPositions(updatedPositions);
    toast({
      title: "Cargo em revisão",
      description: `O cargo ${jobPosition.title} foi marcado para revisão.`
    });
  };

  // Handle distribute
  const handleDistribute = (jobPosition: JobPosition) => {
    const updatedPositions = jobPositions.map(pos =>
      pos.id === jobPosition.id
        ? {
            ...pos,
            status: "distributed" as const
          }
        : pos
    );
    setJobPositions(updatedPositions);
    toast({
      title: "Cargo distribuído",
      description: `O cargo ${jobPosition.title} foi distribuído com sucesso.`
    });
  };

  // Handle edit from details dialog
  const handleEditFromDetails = () => {
    setIsDetailsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  // Handle save from edit dialog
  const handleSaveJobPosition = (updatedJobPosition: JobPosition) => {
    if (selectedJobPosition) {
      // Updating existing job position
      setJobPositions(jobPositions.map(pos =>
        pos.id === updatedJobPosition.id ? updatedJobPosition : pos
      ));
      toast({
        title: "Cargo atualizado",
        description: `O cargo ${updatedJobPosition.title} foi atualizado com sucesso.`
      });
    } else {
      // Creating new job position
      setJobPositions([...jobPositions, updatedJobPosition]);
      toast({
        title: "Cargo criado",
        description: `O cargo ${updatedJobPosition.title} foi criado com sucesso.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Plano de Cargos e Salários</h2>
        <Button onClick={() => {
          setSelectedJobPosition(undefined);
          setIsNewJobDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Descrição de Cargo
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Total de Cargos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobPositions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Departamentos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(jobPositions.map(job => job.department)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Cargos Aprovados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobPositions.filter(job => job.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions">
        <TabsList className="mb-6">
          <TabsTrigger value="positions">Cargos</TabsTrigger>
          <TabsTrigger value="market">Análise de Mercado</TabsTrigger>
          <TabsTrigger value="career">Planos de Carreira</TabsTrigger>
          <TabsTrigger value="orgchart">Organograma Corporativo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions">
          <JobPositionTable 
            jobPositions={jobPositions}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onRevise={handleRevise}
            onDistribute={handleDistribute}
          />
        </TabsContent>
        
        <TabsContent value="market">
          <SalaryComparisonChart formatCurrency={formatCurrency} />
        </TabsContent>
        
        <TabsContent value="career">
          <CareerPathView />
        </TabsContent>
        
        <TabsContent value="orgchart">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Organograma Corporativo</h3>
              <p className="text-muted-foreground">
                Estrutura organizacional completa com cargos, departamentos e hierarquia
              </p>
            </div>
            <DepartmentOrgChart 
              positions={jobPositions.map(job => ({
                id: job.id,
                title: job.title,
                department: job.department,
                level: job.status,
                parentPosition: job.immediate_supervisor_position
              }))}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating new job positions */}
      <JobPositionDialog 
        isOpen={isNewJobDialogOpen} 
        onClose={() => setIsNewJobDialogOpen(false)}
        onSave={handleSaveJobPosition}
      />
      
      {/* Dialog for editing existing job positions */}
      {selectedJobPosition && (
        <JobPositionDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveJobPosition}
          jobPosition={selectedJobPosition}
        />
      )}
      
      {/* Dialog for viewing job position details */}
      {selectedJobPosition && (
        <JobPositionDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          jobPosition={selectedJobPosition}
          onEdit={handleEditFromDetails}
          onApprove={() => {
            handleApprove(selectedJobPosition);
            setIsDetailsDialogOpen(false);
          }}
          onRevise={() => {
            handleRevise(selectedJobPosition);
            setIsDetailsDialogOpen(false);
          }}
          onDistribute={() => {
            handleDistribute(selectedJobPosition);
            setIsDetailsDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
