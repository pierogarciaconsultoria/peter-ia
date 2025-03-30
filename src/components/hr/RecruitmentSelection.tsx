
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Plus, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecruitmentSelection() {
  // Mock data for recruitment processes
  const [recruitmentProcesses] = useState([
    {
      id: "rp1",
      title: "Desenvolvedor React Senior",
      department: "Tecnologia",
      applications: 24,
      openDate: "2023-09-15",
      status: "active",
      positions: 2,
      stage: "entrevista"
    },
    {
      id: "rp2",
      title: "Analista de RH",
      department: "Recursos Humanos",
      applications: 15,
      openDate: "2023-10-01",
      status: "active",
      positions: 1,
      stage: "teste"
    },
    {
      id: "rp3",
      title: "Gerente de Operações",
      department: "Operações",
      applications: 8,
      openDate: "2023-08-20",
      status: "closed",
      positions: 1,
      stage: "finalizado"
    }
  ]);

  // Mock data for candidates
  const [topCandidates] = useState([
    {
      id: "c1",
      name: "Ana Silva",
      position: "Desenvolvedor React Senior",
      score: 92,
      status: "finalista",
      avatar: ""
    },
    {
      id: "c2",
      name: "Marco Oliveira",
      position: "Analista de RH",
      score: 88,
      status: "entrevista",
      avatar: ""
    },
    {
      id: "c3",
      name: "Julia Santos",
      position: "Desenvolvedor React Senior",
      score: 85,
      status: "teste técnico",
      avatar: ""
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Encerrado</Badge>;
      case "finalista":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Finalista</Badge>;
      case "entrevista":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Entrevista</Badge>;
      case "teste técnico":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Teste Técnico</Badge>;
      case "teste":
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Fase de Testes</Badge>;
      case "finalizado":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Recrutamento e Seleção</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">3 posições em aberto</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Candidatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">39</div>
            <p className="text-xs text-muted-foreground">12 novos esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entrevistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Processos Seletivos</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaga</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Candidaturas</TableHead>
                <TableHead>Posições</TableHead>
                <TableHead>Data de Abertura</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recruitmentProcesses.map((process) => (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">{process.title}</TableCell>
                  <TableCell>{process.department}</TableCell>
                  <TableCell>{process.applications}</TableCell>
                  <TableCell>{process.positions}</TableCell>
                  <TableCell>{new Date(process.openDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{getStatusBadge(process.stage)}</TableCell>
                  <TableCell>{getStatusBadge(process.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Candidatos Destaques</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>{candidate.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-medium">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">Pontuação: <span className="font-semibold">{candidate.score}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Status: {getStatusBadge(candidate.status)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" /> CV
                    </Button>
                    <Button size="sm">
                      <UserCheck className="h-4 w-4 mr-1" /> Avaliar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
