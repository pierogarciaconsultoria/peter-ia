
import { useState } from "react";
import { useClimateSurveys } from "@/hooks/useClimateSurveys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusCircle, Search, Edit, Trash2, FileText, BarChart2, Eye } from "lucide-react";
import { NewSurveyDialog } from "./NewSurveyDialog";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export function ClimateSurveyList() {
  const { 
    surveys, 
    isLoading, 
    removeSurvey, 
    fetchSurveys 
  } = useClimateSurveys();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewSurveyDialog, setShowNewSurveyDialog] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filtrar pesquisas pela busca
  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status da pesquisa formatado em português
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "destructive" }> = {
      draft: { label: "Rascunho", variant: "secondary" },
      active: { label: "Ativa", variant: "default" },
      completed: { label: "Concluída", variant: "outline" },
      archived: { label: "Arquivada", variant: "destructive" }
    };
    
    return statusMap[status] || { label: status, variant: "secondary" };
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Navegar para a página de edição da pesquisa
  const handleEditSurvey = (id: string) => {
    navigate(`/human-resources?activeTab=climate&survey=${id}`);
  };

  // Navegar para a página de resultados da pesquisa
  const handleViewResults = (id: string) => {
    navigate(`/human-resources?activeTab=climate&survey=${id}&view=results`);
  };

  // Navegar para a página de responder a pesquisa
  const handleViewSurvey = (id: string) => {
    navigate(`/human-resources?activeTab=climate&survey=${id}&view=preview`);
  };

  // Confirmar exclusão da pesquisa
  const confirmDeleteSurvey = async () => {
    if (surveyToDelete) {
      await removeSurvey(surveyToDelete);
      setSurveyToDelete(null);
    }
  };

  // Renderizar o estado de carregamento
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pesquisas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setShowNewSurveyDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Pesquisa de Clima
        </Button>
      </div>
      
      {filteredSurveys.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurveys.map((survey) => {
                  const status = getStatusDisplay(survey.status);
                  return (
                    <TableRow key={survey.id}>
                      <TableCell className="font-medium">
                        {survey.title}
                        <p className="text-xs text-muted-foreground mt-1">{survey.description}</p>
                      </TableCell>
                      <TableCell>
                        {formatDate(survey.start_date)} até {formatDate(survey.end_date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewSurvey(survey.id)}
                            title="Visualizar pesquisa"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewResults(survey.id)}
                            title="Ver resultados"
                          >
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditSurvey(survey.id)}
                            title="Editar pesquisa"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setSurveyToDelete(survey.id)}
                            title="Excluir pesquisa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma pesquisa encontrada</CardTitle>
            <CardDescription>
              {searchTerm ? "Nenhuma pesquisa corresponde aos critérios de busca." : "Crie sua primeira pesquisa de clima organizacional."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
            <FileText className="h-16 w-16 text-muted-foreground mb-6" />
            <p className="text-center text-muted-foreground max-w-md mb-6">
              {searchTerm 
                ? "Tente usar termos diferentes na sua busca ou limpe o filtro para ver todas as pesquisas."
                : "Pesquisas de clima organizacional são ferramentas essenciais para medir a satisfação e engajamento dos colaboradores."}
            </p>
            <Button onClick={() => setShowNewSurveyDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {searchTerm ? "Criar Nova Pesquisa" : "Criar Primeira Pesquisa"}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Dialog para criar nova pesquisa */}
      <NewSurveyDialog 
        open={showNewSurveyDialog} 
        onOpenChange={setShowNewSurveyDialog} 
        onSurveyCreated={(newSurvey) => {
          fetchSurveys();
          if (newSurvey) {
            handleEditSurvey(newSurvey.id);
          }
        }}
      />
      
      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={!!surveyToDelete} onOpenChange={(open) => !open && setSurveyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pesquisa de clima? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSurvey} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
