
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar,
  Clock,
  FileDown,
  Plus,
  Search,
  UserMinus
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
import { ExitInterviewFormDialog, ExitInterviewData } from "./exit-interviews/ExitInterviewFormDialog";
import { ExitInterviewReports } from "./exit-interviews/ExitInterviewReports";

export function ExitInterviews() {
  // State for exit interviews data
  const [exitInterviews, setExitInterviews] = useState([
    {
      id: "exit1",
      employeeName: "Ana Beatriz Torres",
      position: "Designer UX Senior",
      exitDate: new Date("2023-09-30"),
      reason: "proposta_melhor",
      status: "realizada",
      feedback: "Gostou da cultura da empresa, mas recebeu proposta com melhor remuneração e benefícios.",
      department: "Design",
      overallExperience: "boa",
      wouldRecommend: "sim"
    },
    {
      id: "exit2",
      employeeName: "Carlos Mendes",
      position: "Desenvolvedor Front-end",
      exitDate: new Date("2023-10-15"),
      reason: "mudanca_carreira",
      status: "agendada",
      department: "Tecnologia"
    },
    {
      id: "exit3",
      employeeName: "Patrícia Lima",
      position: "Analista de Marketing",
      exitDate: new Date("2023-08-25"),
      reason: "realocacao",
      status: "realizada",
      feedback: "Mudança para outra cidade. Satisfeita com a experiência na empresa.",
      department: "Marketing",
      overallExperience: "excelente",
      wouldRecommend: "sim"
    }
  ]);
  
  // State for dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("interviews");

  const openInterviewDetails = (interview: any) => {
    setSelectedInterview(interview);
    setIsDialogOpen(true);
  };
  
  const handleNewInterview = () => {
    setIsFormDialogOpen(true);
  };
  
  const handleInterviewSubmit = (data: ExitInterviewData) => {
    const newInterview = {
      id: `exit${exitInterviews.length + 1}`,
      ...data,
      status: "realizada",
      // Ensure required fields have default values if they're missing
      feedback: data.feedback || "",
      improvementSuggestions: data.improvementSuggestions || ""
    };
    
    setExitInterviews([newInterview, ...exitInterviews]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendada":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Agendada</Badge>;
      case "realizada":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Realizada</Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Entrevistas de Desligamento</h2>
        <Button onClick={handleNewInterview}>
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
                Entrevistas Realizadas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exitInterviews.filter(p => p.status === "realizada").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Entrevistas Agendadas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exitInterviews.filter(p => p.status === "agendada").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <UserMinus className="h-4 w-4 mr-2" />
                Desligamentos (Mês)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="interviews">Lista de Entrevistas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios e Análises</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interviews">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Data de Saída</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exitInterviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell className="font-medium">{interview.employeeName}</TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>{interview.department}</TableCell>
                    <TableCell>{interview.exitDate.toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      {interview.reason === "proposta_melhor" && "Proposta melhor"}
                      {interview.reason === "mudanca_carreira" && "Mudança de carreira"}
                      {interview.reason === "realocacao" && "Realocação"}
                      {interview.reason === "motivos_pessoais" && "Motivos pessoais"}
                      {interview.reason === "ambiente_trabalho" && "Ambiente de trabalho"}
                      {interview.reason === "lideranca" && "Problemas com liderança"}
                      {interview.reason === "salario_beneficios" && "Salário/benefícios"}
                      {interview.reason === "outro" && "Outro"}
                    </TableCell>
                    <TableCell>{getStatusBadge(interview.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openInterviewDetails(interview)}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                        {interview.status === "realizada" && (
                          <Button variant="outline" size="icon">
                            <FileDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <ExitInterviewReports interviews={exitInterviews} />
        </TabsContent>
      </Tabs>

      {/* Interview Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Entrevista de Desligamento</DialogTitle>
            <DialogDescription>
              Informações sobre a entrevista de {selectedInterview?.employeeName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Funcionário</p>
                  <p className="font-medium">{selectedInterview.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-medium">{selectedInterview.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="font-medium">{selectedInterview.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Saída</p>
                  <p className="font-medium">{selectedInterview.exitDate.toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Motivo do Desligamento</p>
                <p className="font-medium">
                  {selectedInterview.reason === "proposta_melhor" && "Proposta melhor"}
                  {selectedInterview.reason === "mudanca_carreira" && "Mudança de carreira"}
                  {selectedInterview.reason === "realocacao" && "Realocação"}
                  {selectedInterview.reason === "motivos_pessoais" && "Motivos pessoais"}
                  {selectedInterview.reason === "ambiente_trabalho" && "Ambiente de trabalho"}
                  {selectedInterview.reason === "lideranca" && "Problemas com liderança"}
                  {selectedInterview.reason === "salario_beneficios" && "Salário/benefícios"}
                  {selectedInterview.reason === "outro" && "Outro"}
                </p>
              </div>
              
              {selectedInterview.feedback && (
                <div>
                  <p className="text-sm text-muted-foreground">Feedback</p>
                  <p className="mt-1 p-2 bg-muted rounded-md">{selectedInterview.feedback}</p>
                </div>
              )}
              
              {selectedInterview.status === "agendada" && (
                <div className="bg-blue-50 p-3 rounded-md text-blue-700">
                  <p className="text-sm flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Entrevista agendada. Atualize o status após a realização.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {selectedInterview?.status === "realizada" ? (
              <Button>
                <FileDown className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            ) : (
              <Button>Marcar como Realizada</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Exit Interview Form */}
      <ExitInterviewFormDialog 
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleInterviewSubmit}
      />
    </div>
  );
}
