
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FileText, Loader2, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EmployeeDossierProps {
  employeeId?: string;
}

export function EmployeeDossierGenerator({ employeeId }: EmployeeDossierProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'employee' | 'multiple'>('employee');
  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    departments: [] as string[],
    selectedEmployeeId: employeeId || "",
  });
  const [selectedSections, setSelectedSections] = useState({
    personalInfo: true,
    jobInfo: true,
    salaryHistory: true,
    familyInfo: true,
    documents: true,
    training: true,
    evaluations: true,
    feedback: true,
    occurrences: true,
  });
  const { toast } = useToast();

  // Lista simulada de funcionários
  const employees = [
    { id: "1", name: "João Silva", department: "Recursos Humanos" },
    { id: "2", name: "Maria Oliveira", department: "Financeiro" },
    { id: "3", name: "Carlos Santos", department: "TI" },
    { id: "4", name: "Ana Souza", department: "Marketing" },
    { id: "5", name: "Pedro Costa", department: "Produção" }
  ];

  // Lista simulada de departamentos
  const departments = [
    "Recursos Humanos",
    "Financeiro",
    "TI",
    "Marketing",
    "Produção",
    "Qualidade"
  ];

  const handleSectionToggle = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSelectAllSections = (select: boolean) => {
    const newState = Object.keys(selectedSections).reduce((acc, key) => {
      acc[key as keyof typeof selectedSections] = select;
      return acc;
    }, {} as typeof selectedSections);
    
    setSelectedSections(newState);
  };

  const handleGenerateDossier = async () => {
    // Validar se pelo menos uma seção foi selecionada
    const hasSelectedSections = Object.values(selectedSections).some(value => value);
    if (!hasSelectedSections) {
      toast({
        title: "Nenhuma seção selecionada",
        description: "Selecione pelo menos uma seção para gerar o dossiê",
        variant: "destructive"
      });
      return;
    }

    // Validar seleção de funcionário para dossiê individual
    if (activeTab === 'employee' && !filters.selectedEmployeeId) {
      toast({
        title: "Nenhum colaborador selecionado",
        description: "Selecione um colaborador para gerar o dossiê",
        variant: "destructive"
      });
      return;
    }

    // Simulação de geração do dossiê
    setIsGenerating(true);
    
    try {
      // Simulação de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Dossiê gerado com sucesso",
        description: activeTab === 'employee' 
          ? "O dossiê do colaborador foi gerado e está pronto para download" 
          : "Os dossiês foram gerados e estão prontos para download"
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao gerar dossiê:", error);
      toast({
        title: "Erro ao gerar dossiê",
        description: "Ocorreu um erro ao gerar o dossiê. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Gerar Dossiê
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Gerar Dossiê de Colaborador</DialogTitle>
          <DialogDescription>
            Selecione as informações que deseja incluir no dossiê e os filtros aplicáveis
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue={employeeId ? "employee" : "multiple"} 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'employee' | 'multiple')}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="employee">Colaborador Individual</TabsTrigger>
            <TabsTrigger value="multiple">Múltiplos Colaboradores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employee">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Selecione o colaborador</Label>
                <Select 
                  value={filters.selectedEmployeeId} 
                  onValueChange={(value) => setFilters({...filters, selectedEmployeeId: value})}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Selecione um colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="multiple">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? (
                          format(filters.startDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data inicial</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) => setFilters({...filters, startDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Data final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? (
                          format(filters.endDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data final</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => setFilters({...filters, endDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Departamentos</Label>
                <div className="grid grid-cols-2 gap-2 rounded-md border p-4">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dept-${dept}`}
                        checked={filters.departments.includes(dept)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({...filters, departments: [...filters.departments, dept]});
                          } else {
                            setFilters({
                              ...filters, 
                              departments: filters.departments.filter(d => d !== dept)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`dept-${dept}`}>{dept}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Seções do Dossiê</CardTitle>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSelectAllSections(true)}
                >
                  Selecionar todas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSelectAllSections(false)}
                >
                  Limpar seleção
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="personalInfo"
                  checked={selectedSections.personalInfo}
                  onCheckedChange={() => handleSectionToggle('personalInfo')}
                />
                <Label htmlFor="personalInfo">Dados Pessoais</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="jobInfo"
                  checked={selectedSections.jobInfo}
                  onCheckedChange={() => handleSectionToggle('jobInfo')}
                />
                <Label htmlFor="jobInfo">Dados Profissionais</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="salaryHistory"
                  checked={selectedSections.salaryHistory}
                  onCheckedChange={() => handleSectionToggle('salaryHistory')}
                />
                <Label htmlFor="salaryHistory">Histórico Salarial</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="familyInfo"
                  checked={selectedSections.familyInfo}
                  onCheckedChange={() => handleSectionToggle('familyInfo')}
                />
                <Label htmlFor="familyInfo">Informações Familiares</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="documents"
                  checked={selectedSections.documents}
                  onCheckedChange={() => handleSectionToggle('documents')}
                />
                <Label htmlFor="documents">Documentação</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training"
                  checked={selectedSections.training}
                  onCheckedChange={() => handleSectionToggle('training')}
                />
                <Label htmlFor="training">Treinamentos</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="evaluations"
                  checked={selectedSections.evaluations}
                  onCheckedChange={() => handleSectionToggle('evaluations')}
                />
                <Label htmlFor="evaluations">Avaliações</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="feedback"
                  checked={selectedSections.feedback}
                  onCheckedChange={() => handleSectionToggle('feedback')}
                />
                <Label htmlFor="feedback">Feedbacks</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="occurrences"
                  checked={selectedSections.occurrences}
                  onCheckedChange={() => handleSectionToggle('occurrences')}
                />
                <Label htmlFor="occurrences">Ocorrências</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateDossier} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Gerar Dossiê
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
