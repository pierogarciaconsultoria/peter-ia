
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send, Users, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NewAssessmentDialog } from "./NewAssessmentDialog";
import { AssessmentsList } from "./AssessmentsList";
import { SendAssessmentDialog } from "./SendAssessmentDialog";
import { AssessmentResultsList } from "./AssessmentResultsList";
import { 
  getAssessments, 
  CandidateAssessment 
} from "@/services/candidateAssessmentService";

export function CandidateAssessmentManager() {
  const [assessments, setAssessments] = useState<CandidateAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [isSendAssessmentOpen, setIsSendAssessmentOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<CandidateAssessment | null>(null);
  const { toast } = useToast();
  const { userCompany } = useAuth();

  useEffect(() => {
    fetchAssessments();
  }, [userCompany?.id]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await getAssessments();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Erro ao carregar avaliações",
        description: "Não foi possível carregar as avaliações de candidatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentCreated = () => {
    fetchAssessments();
    setIsNewAssessmentOpen(false);
  };

  const handleSendAssessment = (assessment: CandidateAssessment) => {
    setSelectedAssessment(assessment);
    setIsSendAssessmentOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Avaliações de Candidatos</h2>
          <p className="text-muted-foreground">
            Gerencie avaliações personalizadas para candidatos por tipo de cargo
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => fetchAssessments()}
          >
            <FileText className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button onClick={() => setIsNewAssessmentOpen(true)}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Modelos de Avaliação</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando avaliações...</p>
            </div>
          ) : assessments.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma avaliação criada</CardTitle>
                <CardDescription>
                  Crie avaliações personalizadas para diferentes cargos
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-6">
                <Button onClick={() => setIsNewAssessmentOpen(true)}>
                  Criar Primeira Avaliação
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AssessmentsList 
              assessments={assessments} 
              onSendAssessment={handleSendAssessment}
              onRefresh={fetchAssessments}
            />
          )}
        </TabsContent>
        
        <TabsContent value="results">
          <AssessmentResultsList />
        </TabsContent>
      </Tabs>

      <NewAssessmentDialog 
        open={isNewAssessmentOpen}
        onOpenChange={setIsNewAssessmentOpen}
        onAssessmentCreated={handleAssessmentCreated}
      />
      
      {selectedAssessment && (
        <SendAssessmentDialog
          open={isSendAssessmentOpen}
          onOpenChange={setIsSendAssessmentOpen}
          assessment={selectedAssessment}
        />
      )}
    </div>
  );
}
