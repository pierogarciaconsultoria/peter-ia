
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Candidate } from "@/types/recruitment";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CandidateAnalysisCard } from "./resume-analysis/CandidateAnalysisCard";
import { Loader2 } from "lucide-react";

interface CandidateAnalysisTabProps {
  jobOpeningId?: string;
}

export function CandidateAnalysisTab({ jobOpeningId }: CandidateAnalysisTabProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<Record<string, string>>({});
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar candidatos
        let candidateQuery = supabase.from('candidates').select('*');
        if (jobOpeningId) {
          candidateQuery = candidateQuery.eq('recruitment_process_id', jobOpeningId);
        }
        const { data: candidatesData, error: candidatesError } = await candidateQuery;

        if (candidatesError) throw candidatesError;

        if (candidatesData) {
          setCandidates(candidatesData as Candidate[]);
          
          // Buscar descrições de vagas para todos os processos seletivos
          if (candidatesData.length > 0) {
            const processIds = [...new Set(candidatesData.map(c => c.recruitment_process_id))];
            
            const { data: jobsData, error: jobsError } = await supabase
              .from('hr_job_openings')
              .select('id, description')
              .in('id', processIds);
              
            if (jobsError) throw jobsError;
            
            if (jobsData) {
              const descriptions: Record<string, string> = {};
              jobsData.forEach(job => {
                descriptions[job.id] = job.description;
              });
              setJobDescriptions(descriptions);
            }
          }
        }
        
        // Buscar ID da primeira avaliação DISC disponível
        const { data: assessmentData } = await supabase
          .from('candidate_assessments')
          .select('id')
          .eq('title', 'Avaliação DISC')
          .eq('active', true)
          .limit(1);
          
        if (assessmentData && assessmentData.length > 0) {
          setAssessmentId(assessmentData[0].id);
        } else {
          // Usar um ID mock se não encontrar uma avaliação DISC real
          setAssessmentId("mock-disc-assessment-id");
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os candidatos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobOpeningId, toast]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (candidates.length === 0) {
      return (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">Nenhum candidato encontrado</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Agrupar candidatos por processo seletivo
    const candidatesByProcess: Record<string, Candidate[]> = {};
    candidates.forEach(candidate => {
      if (!candidatesByProcess[candidate.recruitment_process_id]) {
        candidatesByProcess[candidate.recruitment_process_id] = [];
      }
      candidatesByProcess[candidate.recruitment_process_id].push(candidate);
    });

    return (
      <div className="space-y-6">
        {Object.entries(candidatesByProcess).map(([processId, processCandidates]) => {
          // Buscar a descrição da vaga deste processo
          const jobDescription = jobDescriptions[processId] || "Descrição não disponível";
          
          return (
            <div key={processId} className="space-y-4">
              <h3 className="text-lg font-medium">Processo: {processId}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processCandidates.map(candidate => (
                  <CandidateAnalysisCard
                    key={candidate.id}
                    candidate={candidate}
                    jobOpeningId={processId}
                    jobDescription={jobDescription}
                    assessmentId={assessmentId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Análise de Candidatos</CardTitle>
          <CardDescription>
            Use IA para analisar currículos e enviar avaliações DISC para candidatos aprovados
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos os Candidatos</TabsTrigger>
          <TabsTrigger value="analyzed">Analisados</TabsTrigger>
          <TabsTrigger value="pending-disc">Aguardando DISC</TabsTrigger>
          <TabsTrigger value="completed-disc">DISC Concluído</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="analyzed" className="mt-4">
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">Função em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending-disc" className="mt-4">
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">Função em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed-disc" className="mt-4">
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">Função em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
