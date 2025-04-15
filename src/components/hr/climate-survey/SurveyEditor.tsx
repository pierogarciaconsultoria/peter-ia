
import { useState, useEffect } from "react";
import { useClimateSurveys } from "@/hooks/useClimateSurveys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, ArrowLeft, Check, Edit2, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { ClimateSurvey, ClimateSurveyQuestion } from "@/services/climateSurveyService";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyQuestionForm } from "./SurveyQuestionForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SurveyEditorProps {
  surveyId: string;
}

export function SurveyEditor({ surveyId }: SurveyEditorProps) {
  const { 
    currentSurvey, 
    questions, 
    isLoading, 
    isLoadingQuestions,
    fetchSurveyWithQuestions,
    updateSurvey,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions
  } = useClimateSurveys();
  
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "active" | "completed" | "archived">("draft");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ClimateSurveyQuestion | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Carregar os dados da pesquisa
  useEffect(() => {
    fetchSurveyWithQuestions(surveyId);
  }, [surveyId, fetchSurveyWithQuestions]);
  
  // Atualizar estados locais quando a pesquisa for carregada
  useEffect(() => {
    if (currentSurvey) {
      setTitle(currentSurvey.title);
      setDescription(currentSurvey.description);
      setStatus(currentSurvey.status as any);
    }
  }, [currentSurvey]);
  
  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  // Salvar detalhes da pesquisa
  const handleSaveDetails = async () => {
    if (!currentSurvey) return;
    
    setIsSaving(true);
    try {
      await updateSurvey(currentSurvey.id, {
        title,
        description,
        status
      });
      setIsEditingDetails(false);
      toast.success("Detalhes da pesquisa atualizados com sucesso");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Lidar com a criação/atualização de uma pergunta
  const handleSaveQuestion = async (questionData: Omit<ClimateSurveyQuestion, "id">) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, questionData);
        toast.success("Pergunta atualizada com sucesso");
      } else {
        await addQuestion(questionData);
        toast.success("Pergunta adicionada com sucesso");
      }
      setEditingQuestion(undefined);
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error);
    }
  };
  
  // Confirmar exclusão da pergunta
  const confirmDeleteQuestion = async () => {
    if (questionToDelete) {
      await removeQuestion(questionToDelete);
      setQuestionToDelete(null);
    }
  };
  
  // Renderizar visualização para uma pergunta
  const renderQuestionPreview = (question: ClimateSurveyQuestion) => {
    switch (question.question_type) {
      case "scale":
        return (
          <div className="flex items-center space-x-1 mt-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <Button key={num} variant="outline" size="sm" className="h-8 w-8 p-0">
                {num}
              </Button>
            ))}
          </div>
        );
      case "text":
        return <Textarea disabled placeholder="Resposta de texto livre" className="mt-2 bg-muted" />;
      case "multiple_choice":
        return (
          <div className="space-y-2 mt-2">
            {question.options?.choices?.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" disabled />
                <span>{choice}</span>
              </div>
            ))}
          </div>
        );
      case "boolean":
        return (
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <input type="radio" disabled />
              <span>Sim</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" disabled />
              <span>Não</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Obter categoria formatada
  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      geral: "Geral",
      lideranca: "Liderança",
      comunicacao: "Comunicação",
      ambiente: "Ambiente de Trabalho",
      desenvolvimento: "Desenvolvimento Profissional",
      reconhecimento: "Reconhecimento e Recompensa",
      trabalho_equipe: "Trabalho em Equipe",
      bem_estar: "Bem-estar"
    };
    
    return categoryMap[category] || category;
  };
  
  // Voltar para a lista de pesquisas
  const handleBackToList = () => {
    navigate("/human-resources?activeTab=climate");
  };
  
  // Mostrar estados de carregamento
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 mr-2" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  
  if (!currentSurvey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pesquisa não encontrada</CardTitle>
          <CardDescription>
            A pesquisa solicitada não foi encontrada ou você não tem permissão para acessá-la.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={handleBackToList} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <h2 className="text-2xl font-bold">
          {isEditingDetails ? (
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="text-2xl font-bold h-auto py-1"
            />
          ) : (
            currentSurvey.title
          )}
        </h2>
        
        {!isEditingDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2" 
            onClick={() => setIsEditingDetails(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="questions">
            Perguntas {questions.length > 0 && `(${questions.length})`}
          </TabsTrigger>
          <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Pesquisa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingDetails ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Descrição</label>
                    <Textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                        <SelectItem value="archived">Arquivada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setTitle(currentSurvey.title);
                        setDescription(currentSurvey.description);
                        setStatus(currentSurvey.status as any);
                        setIsEditingDetails(false);
                      }}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveDetails} disabled={isSaving}>
                      {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium">Descrição</h3>
                    <p className="mt-1">{currentSurvey.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Período</h3>
                      <p className="mt-1">
                        {formatDate(currentSurvey.start_date)} a {formatDate(currentSurvey.end_date)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <Badge 
                        className="mt-1"
                        variant={
                          currentSurvey.status === "active" ? "default" :
                          currentSurvey.status === "completed" ? "outline" :
                          currentSurvey.status === "archived" ? "destructive" : "secondary"
                        }
                      >
                        {currentSurvey.status === "draft" && "Rascunho"}
                        {currentSurvey.status === "active" && "Ativa"}
                        {currentSurvey.status === "completed" && "Concluída"}
                        {currentSurvey.status === "archived" && "Arquivada"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Data de Criação</h3>
                      <p className="mt-1">
                        {currentSurvey.created_at ? formatDate(currentSurvey.created_at) : "N/A"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Última Atualização</h3>
                      <p className="mt-1">
                        {currentSurvey.updated_at ? formatDate(currentSurvey.updated_at) : "N/A"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Perguntas da Pesquisa</h3>
            <Button onClick={() => {
              setEditingQuestion(undefined);
              setShowQuestionForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </div>
          
          {isLoadingQuestions ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Nenhuma pergunta adicionada</p>
                <p className="text-muted-foreground text-center mb-6">
                  Esta pesquisa ainda não possui perguntas. Adicione perguntas para que os participantes possam responder.
                </p>
                <Button onClick={() => {
                  setEditingQuestion(undefined);
                  setShowQuestionForm(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeira Pergunta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="relative">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  <CardContent className="pt-4 pl-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{getCategoryLabel(question.category)}</Badge>
                          <Badge variant="secondary">{
                            question.question_type === "scale" ? "Escala (1-5)" :
                            question.question_type === "text" ? "Texto Livre" :
                            question.question_type === "multiple_choice" ? "Múltipla Escolha" : "Sim/Não"
                          }</Badge>
                          {question.required && <Badge>Obrigatória</Badge>}
                        </div>
                        
                        <h4 className="text-base font-medium">{question.question}</h4>
                        
                        {renderQuestionPreview(question)}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setEditingQuestion(question);
                            setShowQuestionForm(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setQuestionToDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{currentSurvey.title}</CardTitle>
              <CardDescription>{currentSurvey.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma pergunta foi adicionada a esta pesquisa ainda.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("questions")}
                  >
                    Ir para a seção de perguntas
                  </Button>
                </div>
              ) : (
                <>
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-medium mr-2">{index + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium">
                            {question.question}
                            {question.required && <span className="text-destructive ml-1">*</span>}
                          </p>
                          {renderQuestionPreview(question)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-6">
                    <Button className="w-full md:w-auto" disabled>
                      Enviar Resposta
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Este é apenas um modo de pré-visualização. Para responder à pesquisa, envie o link aos participantes.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Formulário para adicionar/editar pergunta */}
      <SurveyQuestionForm
        open={showQuestionForm}
        onOpenChange={setShowQuestionForm}
        onSave={handleSaveQuestion}
        surveyId={surveyId}
        editingQuestion={editingQuestion}
        maxOrderNumber={questions.length > 0 ? Math.max(...questions.map(q => q.order_number)) : 0}
      />
      
      {/* Dialog de confirmação para excluir pergunta */}
      <AlertDialog open={!!questionToDelete} onOpenChange={(open) => !open && setQuestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteQuestion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
