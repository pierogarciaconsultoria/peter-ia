
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDiscAssessments } from "@/hooks/useDiscAssessments";
import { DiscAssessmentHeader } from "./DiscAssessmentHeader";
import { DiscAssessmentContent } from "./DiscAssessmentContent";
import { NewAssessmentDialog } from "./NewAssessmentDialog";

export function DiscAssessmentContainer() {
  const { assessments, isLoading, fetchAssessments } = useDiscAssessments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAssessments();
      } catch (error) {
        console.error("Failed to load assessments:", error);
        toast.error("Erro ao carregar avaliações", {
          description: "Não foi possível carregar as avaliações DISC"
        });
      }
    };
    
    loadData();
  }, [fetchAssessments]);
  
  const handleRefresh = async () => {
    setIsRetrying(true);
    try {
      await fetchAssessments();
      toast.success("Dados atualizados");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erro ao atualizar dados", {
        description: "Tente novamente mais tarde"
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-6">
      <DiscAssessmentHeader 
        onOpenDialog={() => setIsDialogOpen(true)}
        onRefresh={handleRefresh}
        isRetrying={isRetrying}
        isLoading={isLoading}
      />
      
      <DiscAssessmentContent 
        assessments={assessments}
        isLoading={isLoading}
        onCreateAssessment={() => setIsDialogOpen(true)}
      />
      
      <NewAssessmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchAssessments}
      />
    </div>
  );
}
