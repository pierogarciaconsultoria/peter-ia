
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Eye, FileText, Plus, UserCheck, UserPlus, Share, Link, Globe, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function RecruitmentSelection() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("internal");
  const [isJobPostDialogOpen, setIsJobPostDialogOpen] = useState(false);
  const [jobApplicationDialogOpen, setJobApplicationDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
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
      stage: "entrevista",
      isPublic: true,
      externalUrl: "job-portal/dev-react-senior",
      description: "Estamos em busca de um desenvolvedor React Senior para atuar em projetos desafiadores..."
    },
    {
      id: "rp2",
      title: "Analista de RH",
      department: "Recursos Humanos",
      applications: 15,
      openDate: "2023-10-01",
      status: "active",
      positions: 1,
      stage: "teste",
      isPublic: false,
      externalUrl: "",
      description: "Vaga para analista de RH com experiência em recrutamento e seleção..."
    },
    {
      id: "rp3",
      title: "Gerente de Operações",
      department: "Operações",
      applications: 8,
      openDate: "2023-08-20",
      status: "closed",
      positions: 1,
      stage: "finalizado",
      isPublic: false,
      externalUrl: "",
      description: "Buscamos gerente de operações com experiência em gestão de equipes..."
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
  
  // Public job openings - filtered from recruitmentProcesses
  const publicJobOpenings = recruitmentProcesses.filter(job => job.isPublic && job.status === "active");

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
  
  const handleJobApplication = () => {
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura para a vaga foi recebida com sucesso.",
      duration: 5000,
    });
    setJobApplicationDialogOpen(false);
  };

  const handleCreateJobPost = () => {
    toast({
      title: "Vaga publicada!",
      description: "A vaga agora está disponível publicamente para candidaturas.",
      duration: 5000,
    });
    setIsJobPostDialogOpen(false);
  };

  const copyJobLink = (jobId: string) => {
    const baseUrl = window.location.origin;
    const jobLink = `${baseUrl}/careers/${jobId}`;
    navigator.clipboard.writeText(jobLink);
    toast({
      title: "Link copiado!",
      description: "O link da vaga foi copiado para a área de transferência.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Recrutamento e Seleção</h2>
        <div className="flex gap-2">
          <Dialog open={isJobPostDialogOpen} onOpenChange={setIsJobPostDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Processo Seletivo</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova vaga. Marque como "Publicar" para disponibilizar para candidaturas externas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="job-title">
                    Título
                  </Label>
                  <Input id="job-title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="department">
                    Departamento
                  </Label>
                  <Input id="department" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="positions">
                    Vagas
                  </Label>
                  <Input id="positions" className="col-span-3" type="number" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="job-description">
                    Descrição
                  </Label>
                  <Textarea id="job-description" className="col-span-3" rows={5} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="publish">
                    Publicar
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="publish" />
                    <Label htmlFor="publish">Disponibilizar para candidaturas externas</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsJobPostDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateJobPost}>
                  Criar Vaga
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="internal">Processos Internos</TabsTrigger>
          <TabsTrigger value="public">Divulgação Pública</TabsTrigger>
          <TabsTrigger value="candidates">Candidatos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internal" className="space-y-6">
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
                  <TableHead>Divulgação</TableHead>
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
                      {process.isPublic ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Globe className="mr-1 h-3 w-3" />
                          Pública
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                          Interna
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {process.isPublic && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyJobLink(process.id)}
                          >
                            <Link className="h-4 w-4" />
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
        
        <TabsContent value="public" className="space-y-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Vagas Publicadas</h3>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Prévia do Portal de Vagas
            </Button>
          </div>
          
          {publicJobOpenings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicJobOpenings.map(job => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p className="text-sm line-clamp-3">{job.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Vagas: {job.positions}</span>
                        <span>Candidaturas: {job.applications}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/20 pt-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyJobLink(job.id)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Copiar Link
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Nenhuma vaga publicada externamente.</p>
              <Button variant="outline" className="mt-4">Criar Nova Vaga Pública</Button>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-muted/30 rounded-md border">
            <h4 className="font-medium mb-2">Prévia do Portal de Candidatura</h4>
            <div className="p-4 border rounded-md bg-background">
              <div className="p-4 border rounded-md bg-primary/5 mb-4">
                <h3 className="text-lg font-bold">Desenvolvedor React Senior</h3>
                <p className="text-sm text-muted-foreground">Departamento: Tecnologia</p>
                <div className="mt-4">
                  <p className="text-sm">Estamos em busca de um desenvolvedor React Senior para atuar em projetos desafiadores...</p>
                </div>
              </div>
              
              <Dialog open={jobApplicationDialogOpen} onOpenChange={setJobApplicationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Candidatar-se
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Candidatura - Desenvolvedor React Senior</DialogTitle>
                    <DialogDescription>
                      Preencha suas informações para se candidatar à vaga.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right" htmlFor="name">
                        Nome
                      </Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right" htmlFor="email">
                        E-mail
                      </Label>
                      <Input id="email" className="col-span-3" type="email" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right" htmlFor="phone">
                        Telefone
                      </Label>
                      <Input id="phone" className="col-span-3" type="tel" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right" htmlFor="resume">
                        Currículo
                      </Label>
                      <Input id="resume" className="col-span-3" type="file" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right" htmlFor="cover-letter">
                        Carta
                      </Label>
                      <Textarea id="cover-letter" className="col-span-3" placeholder="Por que você é ideal para esta vaga?" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setJobApplicationDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleJobApplication}>
                      Enviar Candidatura
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
