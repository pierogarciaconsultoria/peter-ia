
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, FileText, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Types for job positions and requests
interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
}

interface PersonnelRequest {
  id: string;
  type: string;
  department: string;
  position: string;
  position_id?: string;
  requestDate: string;
  status: string;
  requester: string;
}

interface RequestFormValues {
  type: string;
  department: string;
  position: string;
  position_id?: string;
  justification: string;
  targetDate: string;
}

export function PersonnelMovement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<PersonnelRequest[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position: "",
      justification: "",
      targetDate: ""
    }
  });
  
  // Fetch job positions from Supabase
  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const { data, error } = await supabase
          .from('job_positions')
          .select('id, title, description, department');
        
        if (error) {
          console.error('Error fetching job positions:', error);
          toast({
            title: "Erro ao carregar cargos",
            description: "Não foi possível carregar a lista de cargos.",
            variant: "destructive",
          });
          return;
        }
        
        setJobPositions(data || []);
      } catch (error) {
        console.error('Error in job positions fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobPositions();
    
    // For demo purposes, we'll continue using the mock requests
    setRequests(mockRequests);
  }, [toast]);
  
  const handleSubmit = (data: RequestFormValues) => {
    // Find the selected job position to get its details
    const selectedPosition = jobPositions.find(job => job.id === data.position);
    
    // In a real implementation, this would send the data to an API
    const newRequest: PersonnelRequest = {
      id: (requests.length + 1).toString(),
      type: data.type,
      department: data.department,
      position: selectedPosition ? selectedPosition.title : data.position,
      position_id: data.position, // Store the position ID
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending",
      requester: "Usuário Atual" // In a real app, this would be the logged-in user
    };
    
    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de movimentação foi registrada com sucesso.",
    });
  };
  
  // Handle department selection to filter job positions
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
    form.setValue("position", ""); // Reset position when department changes
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hiring":
        return "Contratação";
      case "transfer":
        return "Transferência";
      case "termination":
        return "Desligamento";
      case "salary_change":
        return "Alteração Salarial";
      default:
        return type;
    }
  };
  
  // Mock data for personnel movement requests
  const mockRequests = [
    {
      id: "1",
      type: "hiring",
      department: "Engenharia",
      position: "Engenheiro de Produção",
      position_id: "pos-001",
      requestDate: "2023-07-15",
      status: "pending",
      requester: "João Silva"
    },
    {
      id: "2",
      type: "transfer",
      department: "Financeiro",
      position: "Analista Financeiro",
      position_id: "pos-002",
      requestDate: "2023-07-10",
      status: "approved",
      requester: "Maria Oliveira"
    },
    {
      id: "3",
      type: "termination",
      department: "TI",
      position: "Desenvolvedor Frontend",
      position_id: "pos-003",
      requestDate: "2023-07-05",
      status: "rejected",
      requester: "Pedro Santos"
    },
    {
      id: "4",
      type: "salary_change",
      department: "Marketing",
      position: "Coordenador de Marketing",
      position_id: "pos-004",
      requestDate: "2023-07-01",
      status: "pending",
      requester: "Ana Costa"
    }
  ];
  
  // Get unique departments from job positions
  const departments = Array.from(new Set(jobPositions.map(job => job.department)));
  
  // Filter job positions by selected department
  const filteredPositions = jobPositions.filter(
    job => !form.watch("department") || job.department === form.watch("department")
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Movimentação de Pessoal</h2>
          <p className="text-muted-foreground">
            Solicitações de contratação, transferência, desligamento e outras demandas para o RH
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contratações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.type === "hiring").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendentes: {requests.filter(r => r.type === "hiring" && r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transferências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.type === "transfer").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendentes: {requests.filter(r => r.type === "transfer" && r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Desligamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.type === "termination").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendentes: {requests.filter(r => r.type === "termination" && r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
          <CardDescription>
            Gerenciamento de requisições para o setor de Recursos Humanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{getTypeLabel(request.type)}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{request.position}</span>
                      {request.position_id && (
                        <span className="text-xs text-muted-foreground">
                          Cód: {request.position_id}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </CardFooter>
      </Card>
      
      {/* New Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Solicitação de Movimentação</DialogTitle>
            <DialogDescription>
              Preencha os dados para solicitar uma movimentação de pessoal
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Solicitação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hiring">Contratação</SelectItem>
                        <SelectItem value="transfer">Transferência</SelectItem>
                        <SelectItem value="termination">Desligamento</SelectItem>
                        <SelectItem value="salary_change">Alteração Salarial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select 
                      onValueChange={(value) => handleDepartmentChange(value)} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredPositions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.title} - {position.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value && jobPositions.find(p => p.id === field.value)?.description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificativa</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a justificativa para esta solicitação" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Desejada</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Data pretendida para a efetivação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Enviar Solicitação</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
