
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ExternalLink, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Import refactored components
import { JobTable } from "./recruitment/JobTable";
import { JobCard } from "./recruitment/JobCard";
import { CandidateCard } from "./recruitment/CandidateCard";
import { JobPostDialog } from "./recruitment/JobPostDialog";
import { JobPortalPreview } from "./recruitment/JobPortalPreview";
import { RecruitmentMetrics } from "./recruitment/RecruitmentMetrics";
import { getStatusBadge } from "./recruitment/StatusUtils";
import { CandidateAssessmentManager } from "./recruitment/candidate-assessment/CandidateAssessmentManager";

export function RecruitmentSelection() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("internal");
  const [isJobPostDialogOpen, setIsJobPostDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  // Mock data for recruitment processes
  const [recruitmentProcesses] = useState([
    {
      id: "rp1",
      title: "Desenvolvedor React Senior",
      department: "Tecnologia",
      applications: 24,
      openDate: "2023-09-15",
      status: "active",
      positions: 2,
      stage: "entrevista",
      isPublic: true,
      externalUrl: "job-portal/dev-react-senior",
      description: "Estamos em busca de um desenvolvedor React Senior para atuar em projetos desafiadores..."
    },
    {
      id: "rp2",
      title: "Analista de RH",
      department: "Recursos Humanos",
      applications: 15,
      openDate: "2023-10-01",
      status: "active",
      positions: 1,
      stage: "teste",
      isPublic: false,
      externalUrl: "",
      description: "Vaga para analista de RH com experiência em recrutamento e seleção..."
    },
    {
      id: "rp3",
      title: "Gerente de Operações",
      department: "Operações",
      applications: 8,
      openDate: "2023-08-20",
      status: "closed",
      positions: 1,
      stage: "finalizado",
      isPublic: false,
      externalUrl: "",
      description: "Buscamos gerente de operações com experiência em gestão de equipes..."
    }
  ]);

  // Mock data for candidates
  const [topCandidates] = useState([
    {
      id: "c1",
      name: "Ana Silva",
      position: "Desenvolvedor React Senior",
      score: 92,
      status: "finalista",
      avatar: ""
    },
    {
      id: "c2",
      name: "Marco Oliveira",
      position: "Analista de RH",
      score: 88,
      status: "entrevista",
      avatar: ""
    },
    {
      id: "c3",
      name: "Julia Santos",
      position: "Desenvolvedor React Senior",
      score: 85,
      status: "teste técnico",
      avatar: ""
    }
  ]);
  
  // Public job openings - filtered from recruitmentProcesses
  const publicJobOpenings = recruitmentProcesses.filter(job => job.isPublic && job.status === "active");

  const handleJobApplication = () => {
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura para a vaga foi recebida com sucesso.",
      duration: 5000,
    });
  };

  const handleCreateJobPost = () => {
    toast({
      title: "Vaga publicada!",
      description: "A vaga agora está disponível publicamente para candidaturas.",
      duration: 5000,
    });
    setIsJobPostDialogOpen(false);
  };

  const copyJobLink = (jobId: string) => {
    const baseUrl = window.location.origin;
    const jobLink = `${baseUrl}/careers/${jobId}`;
    navigator.clipboard.writeText(jobLink);
    toast({
      title: "Link copiado!",
      description: "O link da vaga foi copiado para a área de transferência.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Recrutamento e Seleção</h2>
        <div className="flex gap-2">
          <JobPostDialog 
            open={isJobPostDialogOpen} 
            onOpenChange={setIsJobPostDialogOpen} 
            onCreateJob={handleCreateJobPost} 
          />
          <Button onClick={() => setIsJobPostDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      <RecruitmentMetrics />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="internal">Processos Internos</TabsTrigger>
          <TabsTrigger value="public">Divulgação Pública</TabsTrigger>
          <TabsTrigger value="candidates">Candidatos</TabsTrigger>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internal" className="space-y-6">
          <JobTable 
            jobs={recruitmentProcesses} 
            getStatusBadge={getStatusBadge} 
            onCopyLink={copyJobLink} 
          />
        </TabsContent>
        
        <TabsContent value="public" className="space-y-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Vagas Publicadas</h3>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Prévia do Portal de Vagas
            </Button>
          </div>
          
          {publicJobOpenings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicJobOpenings.map(job => (
                <JobCard key={job.id} job={job} onCopyLink={copyJobLink} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Nenhuma vaga publicada externamente.</p>
              <Button variant="outline" className="mt-4">Criar Nova Vaga Pública</Button>
            </div>
          )}
          
          <JobPortalPreview onApply={handleJobApplication} />
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-6">
          <h3 className="text-lg font-semibold">Candidatos Destaques</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topCandidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                getStatusBadge={getStatusBadge} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assessments">
          <CandidateAssessmentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
