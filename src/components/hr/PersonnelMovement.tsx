
import { useState } from "react";
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

// Mock data for personnel movement requests
const mockRequests = [
  {
    id: "1",
    type: "hiring",
    department: "Engenharia",
    position: "Engenheiro de Produção",
    requestDate: "2023-07-15",
    status: "pending",
    requester: "João Silva"
  },
  {
    id: "2",
    type: "transfer",
    department: "Financeiro",
    position: "Analista Financeiro",
    requestDate: "2023-07-10",
    status: "approved",
    requester: "Maria Oliveira"
  },
  {
    id: "3",
    type: "termination",
    department: "TI",
    position: "Desenvolvedor Frontend",
    requestDate: "2023-07-05",
    status: "rejected",
    requester: "Pedro Santos"
  },
  {
    id: "4",
    type: "salary_change",
    department: "Marketing",
    position: "Coordenador de Marketing",
    requestDate: "2023-07-01",
    status: "pending",
    requester: "Ana Costa"
  }
];

interface RequestFormValues {
  type: string;
  department: string;
  position: string;
  justification: string;
  targetDate: string;
}

export function PersonnelMovement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState(mockRequests);
  
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position: "",
      justification: "",
      targetDate: ""
    }
  });
  
  const handleSubmit = (data: RequestFormValues) => {
    // In a real implementation, this would send the data to an API
    const newRequest = {
      id: (requests.length + 1).toString(),
      type: data.type,
      department: data.department,
      position: data.position,
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending",
      requester: "Usuário Atual" // In a real app, this would be the logged-in user
    };
    
    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    form.reset();
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
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
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
                  <TableCell>{request.position}</TableCell>
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
                    <FormControl>
                      <Input placeholder="Departamento" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Cargo" {...field} />
                    </FormControl>
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
