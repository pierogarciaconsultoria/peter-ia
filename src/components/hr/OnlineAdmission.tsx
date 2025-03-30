
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  FileCheck, 
  FileText, 
  ListChecks, 
  Loader2, 
  SquareCheck, 
  UserCheck, 
  UserPlus,
  Send,
  ExternalLink
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { NewEmployeeDialog } from "./NewEmployeeDialog";
import { DocumentRequestDialog } from "./DocumentRequestDialog";

export function OnlineAdmission() {
  // Mock data for admission processes
  const [admissionProcesses] = useState([
    {
      id: "adm1",
      name: "João Silva",
      position: "Desenvolvedor React",
      department: "Tecnologia",
      startDate: "2023-10-25",
      status: "documentos_pendentes",
      completion: 65,
      email: "joao.silva@example.com",
      phone: "11987654321"
    },
    {
      id: "adm2",
      name: "Maria Souza",
      position: "Analista de Marketing",
      department: "Marketing",
      startDate: "2023-11-01",
      status: "exame_medico",
      completion: 40,
      email: "maria.souza@example.com"
    },
    {
      id: "adm3",
      name: "Carlos Santos",
      position: "Gerente de Projetos",
      department: "Operações",
      startDate: "2023-10-15",
      status: "contrato_assinado",
      completion: 85,
      phone: "11998765432"
    },
    {
      id: "adm4",
      name: "Ana Oliveira",
      position: "Designer UX",
      department: "Tecnologia",
      startDate: "2023-11-05",
      status: "documentos_enviados",
      completion: 25,
      email: "ana.oliveira@example.com",
      phone: "11912345678"
    }
  ]);

  const [activeDocumentRequestDialog, setActiveDocumentRequestDialog] = useState<{
    isOpen: boolean;
    employeeId: string;
    employeeName: string;
    employeeEmail?: string;
    employeePhone?: string;
  }>({
    isOpen: false,
    employeeId: "",
    employeeName: "",
  });

  const pendingCount = admissionProcesses.filter(p => p.status !== "contrato_assinado").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "documentos_pendentes":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Documentos Pendentes</Badge>;
      case "documentos_enviados":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Documentos Enviados</Badge>;
      case "exame_medico":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Exame Médico</Badge>;
      case "contrato_assinado":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Contrato Assinado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Admissão Online</h2>
        <NewEmployeeDialog triggerButton={
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Nova Admissão
          </Button>
        } />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Admissões Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <SquareCheck className="h-4 w-4 mr-2" />
                Documentações Completas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admissionProcesses.filter(p => p.completion >= 80).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Contratados no Mês
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admissionProcesses.filter(p => p.status === "contrato_assinado").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissionProcesses.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">{process.name}</TableCell>
                    <TableCell>{process.position}</TableCell>
                    <TableCell>{process.department}</TableCell>
                    <TableCell>{new Date(process.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{getStatusBadge(process.status)}</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${process.completion}%` }}>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{process.completion}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Solicitar documentos por link externo"
                          onClick={() => setActiveDocumentRequestDialog({
                            isOpen: true,
                            employeeId: process.id,
                            employeeName: process.name,
                            employeeEmail: process.email,
                            employeePhone: process.phone
                          })}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Ver checklist">
                          <ListChecks className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Ver documentos">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Admissões Pendentes</CardTitle>
              <CardDescription>Processos que ainda precisam de documentação ou aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              {admissionProcesses.filter(p => p.status !== "contrato_assinado").length === 0 ? (
                <div className="text-center py-6">
                  <FileCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">Não há processos pendentes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {admissionProcesses
                    .filter(p => p.status !== "contrato_assinado")
                    .map(process => (
                      <Card key={process.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{process.name}</CardTitle>
                          <CardDescription>{process.position}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span>{getStatusBadge(process.status)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Progresso:</span>
                            <span className="text-sm">{process.completion}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${process.completion}%` }}>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            Ver Detalhes
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Admissões Concluídas</CardTitle>
              <CardDescription>Processos com contrato assinado e documentação completa</CardDescription>
            </CardHeader>
            <CardContent>
              {admissionProcesses.filter(p => p.status === "contrato_assinado").length === 0 ? (
                <div className="text-center py-6">
                  <Loader2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">Nenhuma admissão concluída recentemente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {admissionProcesses
                    .filter(p => p.status === "contrato_assinado")
                    .map(process => (
                      <Card key={process.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{process.name}</CardTitle>
                          <CardDescription>{process.position}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span>{getStatusBadge(process.status)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Data de Início:</span>
                            <span className="text-sm">{new Date(process.startDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            Ver Documentos
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DocumentRequestDialog
        isOpen={activeDocumentRequestDialog.isOpen}
        onOpenChange={(isOpen) => setActiveDocumentRequestDialog(prev => ({ ...prev, isOpen }))}
        employeeId={activeDocumentRequestDialog.employeeId}
        employeeName={activeDocumentRequestDialog.employeeName}
        employeeEmail={activeDocumentRequestDialog.employeeEmail}
        employeePhone={activeDocumentRequestDialog.employeePhone}
      />
    </div>
  );
}
