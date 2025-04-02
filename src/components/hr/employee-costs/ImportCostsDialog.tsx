
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CostItem, ImportFormat } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, FileSpreadsheet, Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ImportCostsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (costs: CostItem[]) => void;
}

// Define sample format for the import file
const importFormat: ImportFormat = {
  headers: ["ID do Colaborador", "Nome do Colaborador", "Salário Base", "Benefícios", "Horas Trabalhadas", "Outros Custos"],
  required: ["ID do Colaborador", "Nome do Colaborador", "Salário Base", "Horas Trabalhadas"],
  sampleData: [
    {
      "ID do Colaborador": "1",
      "Nome do Colaborador": "João Silva",
      "Salário Base": "3500.00",
      "Benefícios": "525.00",
      "Horas Trabalhadas": "168",
      "Outros Custos": "150.00"
    },
    {
      "ID do Colaborador": "2",
      "Nome do Colaborador": "Maria Souza",
      "Salário Base": "4250.00",
      "Benefícios": "637.50",
      "Horas Trabalhadas": "160",
      "Outros Costos": "200.00"
    }
  ]
};

export function ImportCostsDialog({ open, onOpenChange, onImport }: ImportCostsDialogProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());
  const [importedData, setImportedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetDialog = () => {
    setMonth(currentMonth.toString());
    setYear(currentYear.toString());
    setImportedData([]);
    setError(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  // Reset on open change
  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      resetDialog();
    }
    onOpenChange(newOpenState);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError("O arquivo deve ser do tipo CSV ou XLS/XLSX");
      return;
    }
    
    setLoading(true);
    
    // Simulate processing the file
    setTimeout(() => {
      // For demonstration purposes, we'll just generate some random data
      // In a real application, you would parse the Excel/CSV file here
      const mockImportedData = [
        {
          employeeId: '1',
          employeeName: 'João Silva',
          baseSalary: 3500,
          benefits: 525,
          workingHours: 168,
          otherCosts: 150
        },
        {
          employeeId: '2',
          employeeName: 'Maria Souza', 
          baseSalary: 4250,
          benefits: 637.5,
          workingHours: 160,
          otherCosts: 200
        },
        {
          employeeId: '3',
          employeeName: 'Carlos Oliveira',
          baseSalary: 5100,
          benefits: 765,
          workingHours: 176,
          otherCosts: 230
        }
      ];
      
      setImportedData(mockImportedData);
      setLoading(false);
    }, 1000);
  };
  
  const handleDownloadTemplate = () => {
    // In a real application, you would generate and download an Excel template
    alert("Em uma aplicação real, um modelo em Excel seria baixado.");
  };
  
  const handleImport = () => {
    if (importedData.length === 0) {
      setError("Nenhum dado importado para processar");
      return;
    }
    
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    const processedCosts: CostItem[] = importedData.map(data => {
      const baseSalary = typeof data.baseSalary === 'number' ? data.baseSalary : 0;
      const benefits = typeof data.benefits === 'number' ? data.benefits : 0;
      // Calculate taxes (28% of base salary)
      const taxes = baseSalary * 0.28;
      const otherCosts = typeof data.otherCosts === 'number' ? data.otherCosts : 0;
      const totalCost = baseSalary + benefits + taxes + otherCosts;
      const workingHours = typeof data.workingHours === 'number' ? data.workingHours : 160;
      
      return {
        id: uuidv4(),
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        month: monthNum,
        year: yearNum,
        baseSalary,
        benefits,
        taxes,
        otherCosts,
        totalCost,
        workingHours,
        hourCost: totalCost / workingHours
      };
    });
    
    onImport(processedCosts);
    handleOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Importar Custos de Planilha</DialogTitle>
          <DialogDescription>
            Importe dados de custos de colaboradores a partir de uma planilha Excel ou CSV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="import-month">Mês</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="import-month">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="import-year">Ano</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="import-year">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                  <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Arquivo para Importação</h4>
                  <p className="text-sm text-muted-foreground">Formato: Excel (.xlsx) ou CSV</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="gap-2"
                >
                  <Download size={16} />
                  Baixar Modelo
                </Button>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="cost-file">Selecionar Arquivo</Label>
                  <div className="flex gap-2">
                    <input
                      id="cost-file"
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      disabled={loading}
                    />
                    <Button 
                      variant="secondary" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="gap-2"
                    >
                      <FileSpreadsheet size={16} />
                      Escolher Arquivo
                    </Button>
                    <Button 
                      variant="default" 
                      disabled={loading || importedData.length === 0}
                      onClick={handleImport}
                      className="gap-2"
                    >
                      <Upload size={16} />
                      Importar Dados
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Processando arquivo...</p>
            </div>
          )}
          
          {importedData.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Dados Identificados ({importedData.length} registros)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Salário Base</TableHead>
                    <TableHead>Benefícios</TableHead>
                    <TableHead>H. Trabalhadas</TableHead>
                    <TableHead>Outros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.slice(0, 5).map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.employeeName}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.baseSalary)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.benefits)}
                      </TableCell>
                      <TableCell>{data.workingHours}h</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.otherCosts)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {importedData.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        + {importedData.length - 5} registros adicionais
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
