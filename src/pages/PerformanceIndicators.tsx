import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProcessDashboard } from '@/components/indicators/ProcessDashboard';
import { IndicatorsTable } from '@/components/indicators/IndicatorsTable';
import { IndicatorForm } from '@/components/indicators/IndicatorForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useIndicators } from '@/hooks/useIndicators';
import { useProcesses } from '@/hooks/useProcesses'; 
import { IndicatorType } from '@/types/indicators';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type IndicatorFormMode = 'create' | 'edit';

const PerformanceIndicators = () => {
  const [showIndicatorForm, setShowIndicatorForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorType | null>(null);
  const [formMode, setFormMode] = useState<IndicatorFormMode>('create');
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('table');
  const [uniqueProcesses, setUniqueProcesses] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const { 
    indicators, 
    addIndicator, 
    updateIndicator, 
    deleteIndicator,
    isLoading,
    error,
    measurements
  } = useIndicators();

  const { processes } = useProcesses();

  useEffect(() => {
    const processNames = Array.from(
      new Set(indicators.map(indicator => indicator.process))
    ).filter(Boolean) as string[];
    
    const processesWithIndicators = processes
      .filter(process => process.indicators && process.indicators.length > 0)
      .map(process => process.name);
    
    const allProcesses = [...new Set([...processNames, ...processesWithIndicators, "Estratégico"])];
    setUniqueProcesses(allProcesses);
    
    if (allProcesses.includes("Estratégico") && !selectedProcess) {
      setSelectedProcess("Estratégico");
    } 
    else if (allProcesses.length > 0 && !selectedProcess) {
      setSelectedProcess(allProcesses[0]);
    }
  }, [indicators, processes, selectedProcess]);

  const handleCreateIndicator = () => {
    setFormMode('create');
    setEditingIndicator(null);
    setShowIndicatorForm(true);
  };

  const handleEditIndicator = (indicator: IndicatorType) => {
    setFormMode('edit');
    setEditingIndicator(indicator);
    setShowIndicatorForm(true);
  };

  const handleSubmitIndicator = (indicatorData: Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'>) => {
    if (formMode === 'create') {
      addIndicator(indicatorData);
    } else if (editingIndicator) {
      updateIndicator(editingIndicator.id, indicatorData);
    }
    setShowIndicatorForm(false);
  };

  const handleDeleteIndicator = (id: string) => {
    deleteIndicator(id);
  };

  const handleCloseDialog = () => {
    setShowIndicatorForm(false);
  };

  const selectNextProcess = () => {
    const currentIndex = uniqueProcesses.indexOf(selectedProcess as string);
    const nextIndex = (currentIndex + 1) % uniqueProcesses.length;
    setSelectedProcess(uniqueProcesses[nextIndex]);
  };

  const selectPrevProcess = () => {
    const currentIndex = uniqueProcesses.indexOf(selectedProcess as string);
    const prevIndex = (currentIndex - 1 + uniqueProcesses.length) % uniqueProcesses.length;
    setSelectedProcess(uniqueProcesses[prevIndex]);
  };

  const handleGenerateFromStrategy = () => {
    navigate('/strategic-planning');
  };

  const processIndicators = selectedProcess 
    ? indicators.filter(i => i.process === selectedProcess)
    : [];

  const processData = selectedProcess 
    ? processes.find(p => p.name === selectedProcess)
    : null;

  const isStrategicProcess = selectedProcess === "Estratégico";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Indicadores de Desempenho</h1>
              <p className="text-muted-foreground mt-1">
                Monitore e gerencie os indicadores de desempenho da organização
              </p>
            </div>
            <div className="flex gap-2">
              {isStrategicProcess && (
                <>
                  <Link 
                    to="/strategic-planning"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Ver Planejamento Estratégico
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Button variant="outline" onClick={handleGenerateFromStrategy} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Gerar com IA
                  </Button>
                </>
              )}
              <Button onClick={handleCreateIndicator}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Indicador
              </Button>
            </div>
          </div>

          {uniqueProcesses.length > 0 ? (
            <div className="mb-6">
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <Button 
                  variant="ghost" 
                  onClick={selectPrevProcess}
                  disabled={uniqueProcesses.length <= 1}
                >
                  &lt;
                </Button>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{selectedProcess}</h2>
                  <p className="text-sm text-muted-foreground">
                    {processIndicators.length} indicadores
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={selectNextProcess}
                  disabled={uniqueProcesses.length <= 1}
                >
                  &gt;
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-6 rounded-lg text-center mb-6">
              <p className="text-muted-foreground">
                Nenhum processo com indicadores encontrado. Crie um novo indicador ou adicione indicadores a um processo.
              </p>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="table">Tabela</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-4">
              {selectedProcess && (
                <IndicatorsTable 
                  indicators={processIndicators}
                  measurements={measurements}
                  onEdit={handleEditIndicator}
                  onAddMeasurement={() => {}}
                  onDelete={handleDeleteIndicator}
                />
              )}
            </TabsContent>
            
            <TabsContent value="dashboard" className="mt-4">
              {selectedProcess && (
                <ProcessDashboard 
                  process={selectedProcess}
                  indicators={processIndicators}
                  measurements={measurements}
                  processIndicators={processData?.indicators || []}
                />
              )}
            </TabsContent>
          </Tabs>

          <Dialog open={showIndicatorForm} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {formMode === 'create' ? 'Novo Indicador' : 'Editar Indicador'}
                </DialogTitle>
              </DialogHeader>
              <IndicatorForm 
                indicator={editingIndicator}
                onClose={handleCloseDialog}
                afterSubmit={handleSubmitIndicator}
                defaultProcess={selectedProcess || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PerformanceIndicators;
