
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndicatorsTable } from '@/components/indicators/IndicatorsTable';
import { ProcessDashboard } from '@/components/indicators/ProcessDashboard';
import { IndicatorType, MeasurementType } from '@/types/indicators';

interface IndicatorContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  selectedProcess: string | null;
  processIndicators: IndicatorType[];
  measurements: MeasurementType[];
  onEditIndicator: (indicator: IndicatorType) => void;
  onAddMeasurement: (indicator: IndicatorType) => void;
  onDeleteIndicator: (id: string) => void;
  processData: any | null;
}

export function IndicatorContentTabs({
  activeTab,
  setActiveTab,
  selectedProcess,
  processIndicators,
  measurements,
  onEditIndicator,
  onAddMeasurement,
  onDeleteIndicator,
  processData
}: IndicatorContentTabsProps) {
  return (
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
            onEdit={onEditIndicator}
            onAddMeasurement={onAddMeasurement}
            onDelete={onDeleteIndicator}
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
  );
}
