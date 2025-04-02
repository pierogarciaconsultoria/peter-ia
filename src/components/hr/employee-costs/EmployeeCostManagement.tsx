
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CostSummary } from './CostSummary';
import { CostFilters } from './CostFilters';
import { CostsTable } from './CostsTable';
import { NewCostDialog } from './NewCostDialog';
import { ImportCostsDialog } from './ImportCostsDialog';
import { Button } from '@/components/ui/button';
import { CostItem, EmployeeCostFilter } from './types';
import { AreaChart, Calculator, FilePlus2, FileSpreadsheet, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CostCharts } from './CostCharts';

// Mock data
const generateMockCostData = (): CostItem[] => {
  const months = [1, 2, 3];
  const employees = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Souza' },
    { id: '3', name: 'Carlos Oliveira' },
    { id: '4', name: 'Ana Santos' },
  ];
  
  const costs: CostItem[] = [];
  
  months.forEach(month => {
    employees.forEach(emp => {
      const baseSalary = 3000 + Math.random() * 5000;
      const benefits = baseSalary * 0.15;
      const taxes = baseSalary * 0.28;
      const otherCosts = baseSalary * 0.05;
      const totalCost = baseSalary + benefits + taxes + otherCosts;
      const workingHours = 160 + (Math.random() > 0.5 ? 20 : 0);
      const hourCost = totalCost / workingHours;
      
      costs.push({
        id: `${emp.id}-${month}-2023`,
        employeeId: emp.id,
        employeeName: emp.name,
        month: month,
        year: 2023,
        baseSalary,
        benefits,
        taxes,
        otherCosts,
        totalCost,
        workingHours,
        hourCost,
      });
    });
  });
  
  return costs;
};

export function EmployeeCostManagement() {
  const [costsData, setCostsData] = useState<CostItem[]>(generateMockCostData());
  const [filter, setFilter] = useState<EmployeeCostFilter>({});
  const [isNewCostDialogOpen, setIsNewCostDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  
  const handleAddCost = (newCost: CostItem) => {
    setCostsData([...costsData, newCost]);
  };
  
  const handleImportCosts = (importedCosts: CostItem[]) => {
    setCostsData([...costsData, ...importedCosts]);
  };
  
  const filteredCosts = costsData.filter(cost => {
    if (filter.month && cost.month !== filter.month) return false;
    if (filter.year && cost.year !== filter.year) return false;
    if (filter.employeeId && cost.employeeId !== filter.employeeId) return false;
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestão de Custos de Colaboradores</h2>
          <p className="text-muted-foreground">
            Gerencie custos por colaborador, calcule custo/hora e análise despesas mensais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsNewCostDialogOpen(true)}
            className="gap-2"
          >
            <Plus size={16} />
            Novo Lançamento
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsImportDialogOpen(true)}
            className="gap-2"
          >
            <FileSpreadsheet size={16} />
            Importar Planilha
          </Button>
        </div>
      </div>
      
      <CostSummary costsData={filteredCosts} />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custos por Colaborador</CardTitle>
              <CardDescription>Gerencie os custos mensais com colaboradores</CardDescription>
            </div>
            <CostFilters onFilterChange={setFilter} />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table" className="flex gap-2">
                <Calculator size={16} />
                Dados
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex gap-2">
                <AreaChart size={16} />
                Gráficos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <CostsTable costs={filteredCosts} />
            </TabsContent>
            <TabsContent value="charts">
              <CostCharts costs={filteredCosts} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredCosts.length} registros
          </div>
        </CardFooter>
      </Card>
      
      <NewCostDialog
        open={isNewCostDialogOpen}
        onOpenChange={setIsNewCostDialogOpen}
        onSave={handleAddCost}
      />
      
      <ImportCostsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportCosts}
      />
    </div>
  );
}
