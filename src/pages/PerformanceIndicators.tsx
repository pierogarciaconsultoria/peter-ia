
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { PlusCircle, AlertCircle } from "lucide-react";
import { StatisticCard } from "@/components/StatisticCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndicatorForm } from "@/components/indicators/IndicatorForm";
import { IndicatorsTable } from "@/components/indicators/IndicatorsTable";
import { MonthlyMeasurementForm } from "@/components/indicators/MonthlyMeasurementForm";
import { getAllIndicators, getAllMeasurements } from "@/services/indicatorService";
import { IndicatorType, MeasurementType } from "@/types/indicators";

const PerformanceIndicators = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMeasurementDialogOpen, setIsMeasurementDialogOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType | null>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch all indicators
  const { 
    data: indicators = [], 
    isLoading: isLoadingIndicators,
    error: indicatorsError 
  } = useQuery({
    queryKey: ["indicators"],
    queryFn: getAllIndicators,
  });
  
  // Fetch all measurements
  const { 
    data: measurements = [], 
    isLoading: isLoadingMeasurements,
    error: measurementsError 
  } = useQuery({
    queryKey: ["measurements"],
    queryFn: getAllMeasurements,
  });
  
  // Calculate statistics
  const totalIndicators = indicators.length;
  const indicatorsAchievingGoals = indicators.length > 0 && measurements.length > 0 
    ? calculateIndicatorsAchievingGoals(indicators, measurements)
    : 0;
  
  // Handle opening edit dialog
  const handleEditIndicator = (indicator: IndicatorType) => {
    setSelectedIndicator(indicator);
    setIsEditDialogOpen(true);
  };
  
  // Handle opening add measurement dialog
  const handleAddMeasurement = (indicator: IndicatorType) => {
    setSelectedIndicator(indicator);
    setIsMeasurementDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Indicadores de Desempenho</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Indicador
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Monitore e analise os indicadores de desempenho da sua organização.
          </p>
          
          {/* Stats summary */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <StatisticCard 
              title="Indicadores Cadastrados" 
              value={totalIndicators} 
              description="Total de indicadores" 
              color="bg-blue-500"
              total={100}
            />
            <StatisticCard 
              title="Indicadores na Meta" 
              value={indicatorsAchievingGoals} 
              description="Atingindo objetivos" 
              color="bg-green-500"
              total={totalIndicators}
            />
            <StatisticCard 
              title="Processos Monitorados" 
              value={countUniqueProcesses(indicators)} 
              description="Áreas cobertas" 
              color="bg-purple-500"
              total={10}
            />
          </div>
          
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Tabela de Indicadores</TabsTrigger>
              <TabsTrigger value="processes">Por Processo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              {(isLoadingIndicators || isLoadingMeasurements) ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando indicadores...</p>
                </div>
              ) : indicatorsError ? (
                <div className="flex justify-center items-center h-64 text-destructive">
                  <AlertCircle className="mr-2" />
                  <p>Erro ao carregar os indicadores</p>
                </div>
              ) : (
                <IndicatorsTable 
                  indicators={indicators} 
                  measurements={measurements} 
                  onEdit={handleEditIndicator}
                  onAddMeasurement={handleAddMeasurement}
                />
              )}
            </TabsContent>
            
            <TabsContent value="processes">
              <div className="grid gap-8">
                {getUniqueProcesses(indicators).map((process) => (
                  <div key={process} className="border rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-4">{process}</h3>
                    <IndicatorsTable 
                      indicators={indicators.filter(ind => ind.process === process)} 
                      measurements={measurements} 
                      onEdit={handleEditIndicator}
                      onAddMeasurement={handleAddMeasurement}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Dialog for creating a new indicator */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <IndicatorForm 
          onClose={() => setIsAddDialogOpen(false)} 
          afterSubmit={() => {
            queryClient.invalidateQueries({ queryKey: ["indicators"] });
            setIsAddDialogOpen(false);
          }}
        />
      </Dialog>
      
      {/* Dialog for editing an indicator */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedIndicator && (
          <IndicatorForm 
            indicator={selectedIndicator}
            onClose={() => setIsEditDialogOpen(false)}
            afterSubmit={() => {
              queryClient.invalidateQueries({ queryKey: ["indicators"] });
              setIsEditDialogOpen(false);
            }}
          />
        )}
      </Dialog>
      
      {/* Dialog for adding monthly measurements */}
      <Dialog open={isMeasurementDialogOpen} onOpenChange={setIsMeasurementDialogOpen}>
        {selectedIndicator && (
          <MonthlyMeasurementForm 
            indicator={selectedIndicator}
            onClose={() => setIsMeasurementDialogOpen(false)}
            afterSubmit={() => {
              queryClient.invalidateQueries({ queryKey: ["measurements"] });
              setIsMeasurementDialogOpen(false);
            }}
          />
        )}
      </Dialog>
    </div>
  );
};

// Helper functions
function countUniqueProcesses(indicators: IndicatorType[]): number {
  return new Set(indicators.map(ind => ind.process)).size;
}

function getUniqueProcesses(indicators: IndicatorType[]): string[] {
  return Array.from(new Set(indicators.map(ind => ind.process)));
}

function calculateIndicatorsAchievingGoals(
  indicators: IndicatorType[], 
  measurements: MeasurementType[]
): number {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  return indicators.filter(indicator => {
    const relevantMeasurements = measurements.filter(
      m => m.indicator_id === indicator.id && 
      m.year === currentYear && 
      m.month === currentMonth
    );
    
    if (relevantMeasurements.length === 0) return false;
    
    const value = relevantMeasurements[0].value;
    
    if (indicator.goal_type === 'higher_better') {
      return value >= indicator.goal_value;
    } else if (indicator.goal_type === 'lower_better') {
      return value <= indicator.goal_value;
    } else {
      return value === indicator.goal_value;
    }
  }).length;
}

export default PerformanceIndicators;
