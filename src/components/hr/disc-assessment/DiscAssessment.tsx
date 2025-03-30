
import { useState, useEffect } from "react";
import { PlusCircle, RefreshCcw, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewAssessmentDialog } from "./NewAssessmentDialog";
import { DiscAssessmentTable } from "./DiscAssessmentTable";
import { DiscAssessmentStats } from "./DiscAssessmentStats";
import { useDiscAssessments } from "@/hooks/useDiscAssessments";

export function DiscAssessment() {
  const { assessments, isLoading, fetchAssessments } = useDiscAssessments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);
  
  const handleRefresh = () => {
    fetchAssessments();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Avaliação DISC</h2>
          <p className="text-muted-foreground">
            Gerencie avaliações DISC de colaboradores e candidatos
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>
      </div>
      
      {assessments.length === 0 && !isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma avaliação DISC encontrada</CardTitle>
            <CardDescription>
              Realize sua primeira avaliação DISC para começar a análise de perfis comportamentais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-8">
            <FileQuestion className="h-16 w-16 text-muted-foreground mb-6" />
            <p className="text-center text-muted-foreground max-w-md mb-6">
              A metodologia DISC é um poderoso instrumento de avaliação comportamental
              que ajuda a identificar os diferentes estilos de comportamento e comunicação das pessoas.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Realizar Primeira Avaliação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <DiscAssessmentStats assessments={assessments} />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DiscAssessmentTable assessments={assessments} />
          )}
        </>
      )}
      
      <NewAssessmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchAssessments}
      />
    </div>
  );
}
