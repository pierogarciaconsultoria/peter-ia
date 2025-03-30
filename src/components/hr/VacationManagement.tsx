
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Check,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  User,
  X
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VacationManagement() {
  // Mock data for vacation requests
  const [vacationRequests] = useState([
    {
      id: "vac1",
      employeeName: "Ricardo Ferreira",
      position: "Analista de Sistemas",
      startDate: "2023-11-15",
      endDate: "2023-11-30",
      days: 15,
      status: "aprovado",
      department: "Tecnologia"
    },
    {
      id: "vac2",
      employeeName: "Camila Rocha",
      position: "Designer Gráfico",
      startDate: "2023-12-20",
      endDate: "2024-01-10",
      days: 22,
      status: "pendente",
      department: "Marketing"
    },
    {
      id: "vac3",
      employeeName: "Luciana Alves",
      position: "Analista Financeiro",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      days: 15,
      status: "pendente",
      department: "Financeiro"
    },
    {
      id: "vac4",
      employeeName: "Bruno Costa",
      position: "Gerente de Projetos",
      startDate: "2023-10-05",
      endDate: "2023-10-25",
      days: 20,
      status: "concluido",
      department: "Operações"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "aprovado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aprovado</Badge>;
      case "concluido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case "reprovado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Reprovado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Férias</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Solicitações Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacationRequests.filter(r => r.status === "pendente").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Em Férias Atualmente
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Próximas Férias
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacationRequests.filter(r => r.status === "aprovado").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Solicitações (Mês)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Dias</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[160px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacationRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>
                      {new Date(request.startDate).toLocaleDateString('pt-BR')} a {new Date(request.endDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {request.status === "pendente" && (
                          <>
                            <Button variant="outline" size="icon" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="pt-4">
          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacationRequests
                  .filter(r => r.status === "pendente")
                  .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employeeName}</TableCell>
                      <TableCell>
                        {new Date(request.startDate).toLocaleDateString('pt-BR')} a {new Date(request.endDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4 mr-1" /> Aprovar
                          </Button>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-1" /> Reprovar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="pt-4">
          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Dias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacationRequests
                  .filter(r => r.status === "aprovado")
                  .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employeeName}</TableCell>
                      <TableCell>{request.position}</TableCell>
                      <TableCell>
                        {new Date(request.startDate).toLocaleDateString('pt-BR')} a {new Date(request.endDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{request.days}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Dias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacationRequests
                  .filter(r => r.status === "concluido")
                  .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employeeName}</TableCell>
                      <TableCell>{request.position}</TableCell>
                      <TableCell>
                        {new Date(request.startDate).toLocaleDateString('pt-BR')} a {new Date(request.endDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{request.days}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
