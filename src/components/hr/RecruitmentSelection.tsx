
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { RecruitmentMetrics } from "./recruitment/RecruitmentMetrics";
import { CandidateAssessmentManager } from "./recruitment/candidate-assessment/CandidateAssessmentManager";
import { CandidateAnalysisTab } from "./recruitment/CandidateAnalysisTab";
import { RecruitmentHeader } from "./recruitment/RecruitmentHeader";
import { InternalProcessesTab } from "./recruitment/InternalProcessesTab";
import { PublicJobsTab } from "./recruitment/PublicJobsTab";
import { CandidatesTab } from "./recruitment/CandidatesTab";
import { useRecruitmentData } from "./recruitment/hooks/useRecruitmentData";
import { useRecruitmentActions } from "./recruitment/hooks/useRecruitmentActions";

export function RecruitmentSelection() {
  const [activeTab, setActiveTab] = useState("internal");
  const [isJobPostDialogOpen, setIsJobPostDialogOpen] = useState(false);
  
  const { recruitmentProcesses, topCandidates, publicJobOpenings } = useRecruitmentData();
  const { handleJobApplication, handleCreateJobPost, copyJobLink } = useRecruitmentActions();

  const onCreateJobPost = () => {
    handleCreateJobPost();
    setIsJobPostDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <RecruitmentHeader 
        isJobPostDialogOpen={isJobPostDialogOpen}
        setIsJobPostDialogOpen={setIsJobPostDialogOpen}
        onCreateJob={onCreateJobPost}
      />

      <RecruitmentMetrics />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="internal">Processos Internos</TabsTrigger>
          <TabsTrigger value="public">Divulgação Pública</TabsTrigger>
          <TabsTrigger value="candidates">Candidatos</TabsTrigger>
          <TabsTrigger value="analysis">Análise de Candidatos</TabsTrigger>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internal">
          <InternalProcessesTab 
            recruitmentProcesses={recruitmentProcesses}
            onCopyLink={copyJobLink}
          />
        </TabsContent>
        
        <TabsContent value="public">
          <PublicJobsTab 
            publicJobOpenings={publicJobOpenings}
            onCopyLink={copyJobLink}
            onApply={handleJobApplication}
          />
        </TabsContent>
        
        <TabsContent value="candidates">
          <CandidatesTab topCandidates={topCandidates} />
        </TabsContent>
        
        <TabsContent value="analysis">
          <CandidateAnalysisTab />
        </TabsContent>
        
        <TabsContent value="assessments">
          <CandidateAssessmentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
