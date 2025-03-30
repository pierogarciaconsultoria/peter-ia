
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  CalendarDays, 
  ClipboardList, 
  Eye, 
  FileText, 
  Plus, 
  Search,
  UserRound 
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OccurrenceManagement() {
  // Mock data for occurrences
  const [occurrences] = useState([
    {
      id: "o1",
      employee: {
        name: "João Silva",
        position: "Desenvolvedor React",
        department: "Tecnologia",
        avatar: ""
      },
      type: "warning",
      title: "Atraso Recorrente",
      description: "Funcionário tem apresentado atrasos recorrentes nas últimas duas semanas.",
      date: "2023-10-15",
      reportedBy: "Maria Santos",
      status: "pending"
    },
    {
      id: "o2",
      employee: {
        name: "Ana Oliveira",
        position: "Analista de RH",
        department: "Recursos Humanos",
        avatar: ""
      },
      type: "disciplinary",
      title: "Conflito com Colega",
      description: "Discussão inapropriada com colega de trabalho durante reunião de equipe.",
      date: "2023-10-10",
      reportedBy: "Carlos Mendes",
      status: "in_progress"
    },
    {
      id: "o3",
      employee: {
        name: "Pedro Souza",
        position: "Analista de Marketing",
        department: "Marketing",
        avatar: ""
      },
      type: "observation",
      title: "Performance Abaixo do Esperado",
      description: "Entregas abaixo do esperado no último mês, necessário acompanhamento.",
      date: "2023-10-05",
      reportedBy: "Roberto Alves",
      status: "resolved"
    }
  ]);

  const pendingCount = occurrences.filter(o => o.status === "pending").length;
  const resolvedCount = occurrences.filter(o => o.status === "resolved").length;
  const inProgressCount = occurrences.filter(o => o.status === "in_progress").length;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Advertência</Badge>;
      case "disciplinary":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Disciplinar</Badge>;
      case "observation":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Observação</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pendente</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Em Andamento</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolvido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Ocorrências</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Total de Ocorrências
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occurrences.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Pendentes
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
                <CalendarDays className="h-4 w-4 mr-2" />
                Em Andamento
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <UserRound className="h-4 w-4 mr-2" />
                Resolvidas
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar ocorrências..." 
            className="pl-8" 
          />
        </div>
        
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="warning">Advertência</SelectItem>
              <SelectItem value="disciplinary">Disciplinar</SelectItem>
              <SelectItem value="observation">Observação</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Reportado Por</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occurrences.map((occurrence) => (
              <TableRow key={occurrence.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={occurrence.employee.avatar} />
                      <AvatarFallback>{occurrence.employee.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{occurrence.employee.name}</span>
                      <span className="text-xs text-muted-foreground">{occurrence.employee.department}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(occurrence.type)}</TableCell>
                <TableCell className="font-medium">{occurrence.title}</TableCell>
                <TableCell>{new Date(occurrence.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{occurrence.reportedBy}</TableCell>
                <TableCell>{getStatusBadge(occurrence.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ocorrências Recentes</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {occurrences
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map(occurrence => (
              <Card key={occurrence.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={occurrence.employee.avatar} />
                        <AvatarFallback>{occurrence.employee.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{occurrence.employee.name}</CardTitle>
                        <CardDescription>{occurrence.employee.position}</CardDescription>
                      </div>
                    </div>
                    <div>
                      {getTypeBadge(occurrence.type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <h4 className="font-semibold mb-2">{occurrence.title}</h4>
                  <p className="text-sm">{occurrence.description}</p>
                </CardContent>
                <CardContent className="pt-0 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {new Date(occurrence.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    {getStatusBadge(occurrence.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
