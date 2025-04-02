
import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SalaryRecord {
  id: string;
  date: Date;
  amount: number;
  previousAmount: number | null;
  changePercentage: number | null;
  positionId: string | null;
  positionTitle: string | null;
  reason: string;
  notes: string;
}

interface Position {
  id: string;
  title: string;
  department: string;
}

interface SalaryHistoryProps {
  employeeId: string;
  employeeName: string;
  currentSalary?: number;
  currentPosition?: string;
}

export function SalaryHistoryComponent({ 
  employeeId, 
  employeeName,
  currentSalary = 0,
  currentPosition = ""
}: SalaryHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [salaryHistory, setSalaryHistory] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Estado para o formulário de nova entrada
  const [newRecord, setNewRecord] = useState<{
    date: Date | undefined;
    amount: string;
    positionId: string;
    reason: string;
    notes: string;
  }>({
    date: undefined,
    amount: currentSalary.toString(),
    positionId: "",
    reason: "",
    notes: ""
  });

  // Lista de cargos (simulada)
  const positions: Position[] = [
    { id: "1", title: "Analista de RH", department: "Recursos Humanos" },
    { id: "2", title: "Analista de TI", department: "TI" },
    { id: "3", title: "Coordenador de RH", department: "Recursos Humanos" },
    { id: "4", title: "Supervisor de Produção", department: "Produção" }
  ];

  // Carregar histórico salarial
  const loadSalaryHistory = async () => {
    setIsLoading(true);

    try {
      // Simula busca no banco de dados
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados simulados
      const mockData: SalaryRecord[] = [
        {
          id: "1",
          date: new Date(2022, 2, 15), // 15/03/2022
          amount: 3000,
          previousAmount: null,
          changePercentage: null,
          positionId: "1",
          positionTitle: "Analista de RH",
          reason: "Contratação",
          notes: "Contratação inicial"
        },
        {
          id: "2",
          date: new Date(2022, 8, 1), // 01/09/2022
          amount: 3300,
          previousAmount: 3000,
          changePercentage: 10,
          positionId: "1",
          positionTitle: "Analista de RH",
          reason: "Reajuste anual",
          notes: "Reajuste conforme média do mercado"
        },
        {
          id: "3",
          date: new Date(2023, 3, 10), // 10/04/2023
          amount: 4200,
          previousAmount: 3300,
          changePercentage: 27.27,
          positionId: "3",
          positionTitle: "Coordenador de RH",
          reason: "Promoção",
          notes: "Promoção por mérito e desempenho excepcional no último ano"
        }
      ];

      setSalaryHistory(mockData);
    } catch (error) {
      console.error("Erro ao carregar histórico salarial:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar o histórico salarial",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ao abrir o diálogo
  const handleOpenDialog = () => {
    loadSalaryHistory();
    setIsDialogOpen(true);
  };

  // Adicionar novo registro
  const handleAddRecord = async () => {
    if (!newRecord.date || !newRecord.amount || !newRecord.reason) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simula adição no banco de dados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Encontra o último salário para calcular diferença
      const lastRecord = salaryHistory.length > 0 
        ? salaryHistory[0] 
        : null;
        
      const newAmount = parseFloat(newRecord.amount);
      const previousAmount = lastRecord ? lastRecord.amount : null;
      const changePercentage = previousAmount 
        ? ((newAmount - previousAmount) / previousAmount) * 100
        : null;
      
      // Encontra informações do cargo
      const position = positions.find(p => p.id === newRecord.positionId);
      
      // Cria novo registro
      const newSalaryRecord: SalaryRecord = {
        id: Date.now().toString(),
        date: newRecord.date,
        amount: newAmount,
        previousAmount,
        changePercentage,
        positionId: newRecord.positionId || null,
        positionTitle: position?.title || null,
        reason: newRecord.reason,
        notes: newRecord.notes
      };
      
      // Adiciona no histórico (ordenado por data, mais recente primeiro)
      const updatedHistory = [newSalaryRecord, ...salaryHistory]
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setSalaryHistory(updatedHistory);
      
      toast({
        title: "Registro adicionado",
        description: "O registro de alteração salarial foi adicionado com sucesso"
      });
      
      // Limpa formulário e fecha diálogo
      setNewRecord({
        date: undefined,
        amount: "",
        positionId: "",
        reason: "",
        notes: ""
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar registro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o registro",
        variant: "destructive"
      });
    }
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpenDialog}>
        <LineChart className="h-4 w-4 mr-2" />
        Histórico Salarial
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Histórico Salarial - {employeeName}</DialogTitle>
            <DialogDescription>
              Visualize o histórico de alterações salariais e evoluções na carreira
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Salário Atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salaryHistory.length > 0 ? salaryHistory[0].amount : currentSalary)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Último registro: {salaryHistory.length > 0 
                        ? format(salaryHistory[0].date, "dd/MM/yyyy", { locale: ptBR }) 
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Cargo Atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {salaryHistory.length > 0 && salaryHistory[0].positionTitle 
                        ? salaryHistory[0].positionTitle 
                        : currentPosition || "Não informado"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {salaryHistory.length > 0 && salaryHistory[0].positionTitle !== salaryHistory[salaryHistory.length - 1].positionTitle 
                        ? `Anterior: ${salaryHistory[salaryHistory.length - 1].positionTitle}` 
                        : "Mesmo cargo desde a contratação"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Evolução Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {salaryHistory.length > 1 ? (
                      <>
                        <div className="text-2xl font-bold">
                          {(((salaryHistory[0].amount - salaryHistory[salaryHistory.length - 1].amount) / 
                            salaryHistory[salaryHistory.length - 1].amount) * 100).toFixed(2)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          De {formatCurrency(salaryHistory[salaryHistory.length - 1].amount)} para {formatCurrency(salaryHistory[0].amount)}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">
                          Histórico insuficiente
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de Histórico */}
              <div className="border rounded-md">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-semibold">Registros de Alterações Salariais</h3>
                  <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Alteração
                  </Button>
                </div>
                
                {salaryHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Nenhum registro de alteração salarial encontrado.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Adicionar primeiro registro
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Salário</TableHead>
                        <TableHead>Variação</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaryHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {format(record.date, "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(record.amount)}
                          </TableCell>
                          <TableCell>
                            {record.changePercentage !== null ? (
                              <span className={`${record.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {record.changePercentage > 0 ? '+' : ''}
                                {record.changePercentage.toFixed(2)}%
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>{record.positionTitle || '-'}</TableCell>
                          <TableCell>{record.reason}</TableCell>
                          <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para adicionar novo registro */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Alteração Salarial</DialogTitle>
            <DialogDescription>
              Registre uma nova alteração salarial para o colaborador
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary-date">Data da Alteração*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="salary-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newRecord.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newRecord.date ? (
                      format(newRecord.date, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newRecord.date}
                    onSelect={(date) => setNewRecord({ ...newRecord, date })}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary-amount">Novo Salário*</Label>
              <Input
                id="salary-amount"
                type="number"
                step="0.01"
                value={newRecord.amount}
                onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary-position">Cargo</Label>
              <Select
                value={newRecord.positionId}
                onValueChange={(value) => setNewRecord({ ...newRecord, positionId: value })}
              >
                <SelectTrigger id="salary-position">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Mesmo cargo anterior</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.title} - {position.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary-reason">Motivo da Alteração*</Label>
              <Select
                value={newRecord.reason}
                onValueChange={(value) => setNewRecord({ ...newRecord, reason: value })}
              >
                <SelectTrigger id="salary-reason">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contratação">Contratação</SelectItem>
                  <SelectItem value="Reajuste anual">Reajuste anual</SelectItem>
                  <SelectItem value="Promoção">Promoção</SelectItem>
                  <SelectItem value="Mérito">Mérito</SelectItem>
                  <SelectItem value="Mudança de função">Mudança de função</SelectItem>
                  <SelectItem value="Equiparação salarial">Equiparação salarial</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary-notes">Observações</Label>
              <Textarea
                id="salary-notes"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                placeholder="Adicione detalhes sobre esta alteração salarial..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddRecord}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
