
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";

// Tipos para a análise crítica
interface CriticalAnalysisItem {
  id: string;
  date: Date;
  subject: string;
  status: "planned" | "in-progress" | "completed";
  participants: string[];
  documents: string[];
  results: string;
}

// Dados de exemplo
const mockAnalysis: CriticalAnalysisItem[] = [
  {
    id: "1",
    date: new Date(2023, 10, 15),
    subject: "Análise de Desempenho Q4 2023",
    status: "completed",
    participants: ["Diretor Geral", "Gerente da Qualidade", "Gerente de Produção"],
    documents: ["Indicadores Q4", "Relatório de Não Conformidades"],
    results: "Metas atingidas em 80%. Necessidade de melhorias no processo de inspeção final."
  },
  {
    id: "2",
    date: new Date(2024, 1, 20),
    subject: "Revisão da Política da Qualidade",
    status: "completed",
    participants: ["Diretor Geral", "Gerente da Qualidade", "RH"],
    documents: ["Política da Qualidade", "Objetivos Estratégicos"],
    results: "Política atualizada com novos objetivos de sustentabilidade."
  },
  {
    id: "3",
    date: new Date(2024, 3, 10),
    subject: "Análise de Eficácia das Ações Corretivas",
    status: "in-progress",
    participants: ["Gerente da Qualidade", "Líderes de Setor"],
    documents: ["Relatório de Ações Corretivas", "Indicadores de Reincidência"],
    results: "Em andamento"
  },
  {
    id: "4",
    date: new Date(2024, 6, 5),
    subject: "Planejamento de Auditoria Interna",
    status: "planned",
    participants: ["Auditores Internos", "Gerente da Qualidade"],
    documents: ["Cronograma de Auditoria", "Checklist ISO 9001"],
    results: "Pendente"
  }
];

export default function CriticalAnalysis() {
  const [analyses, setAnalyses] = useState<CriticalAnalysisItem[]>(mockAnalysis);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subject, setSubject] = useState("");
  const [participants, setParticipants] = useState("");
  const [documents, setDocuments] = useState("");
  const [results, setResults] = useState("");

  const handleSave = () => {
    const newAnalysis: CriticalAnalysisItem = {
      id: Date.now().toString(),
      date: date || new Date(),
      subject,
      status: "planned",
      participants: participants.split(',').map(p => p.trim()),
      documents: documents.split(',').map(d => d.trim()),
      results: results
    };

    setAnalyses([...analyses, newAnalysis]);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date());
    setSubject("");
    setParticipants("");
    setDocuments("");
    setResults("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "text-yellow-500";
      case "in-progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "planned":
        return "Planejada";
      case "in-progress":
        return "Em Andamento";
      case "completed":
        return "Concluída";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Navigation />
      
      <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Análise Crítica</h1>
              <p className="text-muted-foreground mt-1">
                Execução e acompanhamento das reuniões de análise crítica pela direção
              </p>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Nova Análise Crítica
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Nova Análise Crítica</DialogTitle>
                  <DialogDescription>
                    Registre uma nova reunião de análise crítica pela direção.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Data
                    </Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      Assunto
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="participants" className="text-right">
                      Participantes
                    </Label>
                    <Input
                      id="participants"
                      value={participants}
                      onChange={(e) => setParticipants(e.target.value)}
                      className="col-span-3"
                      placeholder="Separe por vírgulas"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documents" className="text-right">
                      Documentos
                    </Label>
                    <Input
                      id="documents"
                      value={documents}
                      onChange={(e) => setDocuments(e.target.value)}
                      className="col-span-3"
                      placeholder="Separe por vírgulas"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="results" className="text-right pt-2">
                      Resultados
                    </Label>
                    <Textarea
                      id="results"
                      value={results}
                      onChange={(e) => setResults(e.target.value)}
                      className="col-span-3"
                      placeholder="Registre os resultados ou deixe em branco se for uma análise planejada"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="planned">Planejadas</TabsTrigger>
            <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Análises Críticas</CardTitle>
                <CardDescription>
                  Visualize todas as reuniões de análise crítica pela direção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Resultados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                        <TableCell>{analysis.subject}</TableCell>
                        <TableCell className={getStatusColor(analysis.status)}>
                          {getStatusText(analysis.status)}
                        </TableCell>
                        <TableCell>{analysis.participants.join(", ")}</TableCell>
                        <TableCell>{analysis.documents.join(", ")}</TableCell>
                        <TableCell>{analysis.results}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planned">
            <Card>
              <CardHeader>
                <CardTitle>Análises Críticas Planejadas</CardTitle>
                <CardDescription>
                  Próximas reuniões de análise crítica agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses
                      .filter((a) => a.status === "planned")
                      .map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{analysis.subject}</TableCell>
                          <TableCell>{analysis.participants.join(", ")}</TableCell>
                          <TableCell>{analysis.documents.join(", ")}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="in-progress">
            <Card>
              <CardHeader>
                <CardTitle>Análises Críticas em Andamento</CardTitle>
                <CardDescription>
                  Reuniões de análise crítica que estão em curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Resultados Parciais</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses
                      .filter((a) => a.status === "in-progress")
                      .map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{analysis.subject}</TableCell>
                          <TableCell>{analysis.participants.join(", ")}</TableCell>
                          <TableCell>{analysis.documents.join(", ")}</TableCell>
                          <TableCell>{analysis.results}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Análises Críticas Concluídas</CardTitle>
                <CardDescription>
                  Histórico de reuniões de análise crítica finalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Resultados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses
                      .filter((a) => a.status === "completed")
                      .map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{analysis.subject}</TableCell>
                          <TableCell>{analysis.participants.join(", ")}</TableCell>
                          <TableCell>{analysis.documents.join(", ")}</TableCell>
                          <TableCell>{analysis.results}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
