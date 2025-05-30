
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar,
  Clock,
  UserMinus,
  Search,
  FileDown,
  Send,
  Copy,
  Check
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExitInterview } from "@/types/exitInterviews";
import { ExitInterviewService } from "@/services/exitInterviewService";
import { NewExitInterviewDialog } from "./NewExitInterviewDialog";
import { ExitInterviewDetailsDialog } from "./ExitInterviewDetailsDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ExitInterviewDashboard() {
  const [exitInterviews, setExitInterviews] = useState<ExitInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<ExitInterview | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get user's company ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', userData.user.id)
        .single();

      if (!profileData?.company_id) return;
      
      setCompanyId(profileData.company_id);

      // Fetch exit interviews
      const interviews = await ExitInterviewService.getExitInterviews(profileData.company_id);
      setExitInterviews(interviews);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as entrevistas de desligamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInterview = async () => {
    await loadData();
    setIsNewDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Entrevista de desligamento criada com sucesso.",
    });
  };

  const openInterviewDetails = (interview: ExitInterview) => {
    setSelectedInterview(interview);
    setIsDetailsDialogOpen(true);
  };

  const copyInterviewLink = async (interview: ExitInterview) => {
    const link = ExitInterviewService.generateInterviewLink(interview.token);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedToken(interview.token);
      toast({
        title: "Link copiado",
        description: "Link da entrevista copiado para a área de transferência.",
      });
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const markAsSent = async (interview: ExitInterview) => {
    try {
      await ExitInterviewService.markAsSent(interview.id);
      await loadData();
      toast({
        title: "Sucesso",
        description: "Entrevista marcada como enviada.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "sent":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Enviada</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completa</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Entrevistas de Desligamento</h2>
          <p className="text-muted-foreground">
            Gerencie entrevistas de desligamento e colete feedback dos funcionários
          </p>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrevista
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Entrevistas Completas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exitInterviews.filter(i => i.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Entrevistas Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exitInterviews.filter(i => i.status === "pending" || i.status === "sent").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <UserMinus className="h-4 w-4 mr-2" />
                Total de Desligamentos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exitInterviews.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Entrevistas</CardTitle>
          <CardDescription>
            Entrevistas de desligamento criadas e seu status atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-muted-foreground">Carregando...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Data de Saída</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[200px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exitInterviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-sm text-muted-foreground">
                          Nenhuma entrevista de desligamento encontrada.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    exitInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">{interview.employee_name}</TableCell>
                        <TableCell>{new Date(interview.termination_date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{interview.termination_reason || '-'}</TableCell>
                        <TableCell>{getStatusBadge(interview.status)}</TableCell>
                        <TableCell>{new Date(interview.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openInterviewDetails(interview)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                            
                            {interview.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyInterviewLink(interview)}
                                >
                                  {copiedToken === interview.token ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markAsSent(interview)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {interview.status === "completed" && (
                              <Button variant="outline" size="sm">
                                <FileDown className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <NewExitInterviewDialog
        isOpen={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSuccess={handleCreateInterview}
        companyId={companyId}
      />

      <ExitInterviewDetailsDialog
        interview={selectedInterview}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
}
