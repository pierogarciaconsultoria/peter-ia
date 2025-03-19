
import { useMemo, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IndicatorType, MeasurementType } from "@/types/indicators";

interface IndicatorsTableProps {
  indicators: IndicatorType[];
  measurements: MeasurementType[];
  onEdit: (indicator: IndicatorType) => void;
  onAddMeasurement: (indicator: IndicatorType) => void;
}

export function IndicatorsTable({ 
  indicators, 
  measurements, 
  onEdit,
  onAddMeasurement 
}: IndicatorsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Get current year and past 11 months for display
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JS months are 0-indexed
  
  // Generate array of last 12 months in format [{ month: 1, year: 2023 }, ...]
  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      
      result.push({ month, year });
    }
    return result.reverse();
  }, [currentMonth, currentYear]);
  
  // Toggle row expansion
  const toggleRowExpansion = (indicatorId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [indicatorId]: !prev[indicatorId]
    }));
  };
  
  // Get measurement value for a specific indicator and month
  const getMeasurementValue = (indicatorId: string, month: number, year: number) => {
    const measurement = measurements.find(m => 
      m.indicator_id === indicatorId && 
      m.month === month && 
      m.year === year
    );
    
    return measurement ? measurement.value : null;
  };
  
  // Get summary value (total or average) for an indicator across all months
  const getSummaryValue = (indicator: IndicatorType) => {
    const relevantMeasurements = measurements.filter(
      m => m.indicator_id === indicator.id
    );
    
    if (relevantMeasurements.length === 0) return null;
    
    if (indicator.calculation_type === 'sum') {
      return relevantMeasurements.reduce((sum, m) => sum + m.value, 0);
    } else {
      // Average
      return (
        relevantMeasurements.reduce((sum, m) => sum + m.value, 0) / 
        relevantMeasurements.length
      ).toFixed(2);
    }
  };
  
  // Format goal type for display
  const formatGoalType = (goalType: string) => {
    switch (goalType) {
      case 'higher_better': return '↑';
      case 'lower_better': return '↓';
      case 'target': return '=';
      default: return '';
    }
  };
  
  // Check if a value meets the goal
  const isGoalMet = (value: number | null, indicator: IndicatorType) => {
    if (value === null) return false;
    
    switch (indicator.goal_type) {
      case 'higher_better': return value >= indicator.goal_value;
      case 'lower_better': return value <= indicator.goal_value;
      case 'target': return value === indicator.goal_value;
      default: return false;
    }
  };
  
  // Format month for display
  const formatMonth = (month: number) => {
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return monthNames[month - 1];
  };
  
  if (indicators.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-4">Nenhum indicador cadastrado.</p>
        <Button variant="outline">Adicionar Indicador</Button>
      </div>
    );
  }
  
  return (
    <Table>
      <TableCaption>
        Lista de indicadores e suas medições mensais
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead className="min-w-[250px]">Indicador</TableHead>
          <TableHead>Processo</TableHead>
          <TableHead>Meta</TableHead>
          {months.map(({ month, year }) => (
            <TableHead key={`${year}-${month}`} className="text-center">
              {formatMonth(month)}<br/>{year}
            </TableHead>
          ))}
          <TableHead className="text-center">{indicators[0]?.calculation_type === 'sum' ? 'Total' : 'Média'}</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {indicators.map(indicator => {
          const isExpanded = expandedRows[indicator.id] || false;
          
          return (
            <TableRow key={indicator.id} className="hover:bg-muted/50">
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRowExpansion(indicator.id)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                {indicator.name}
                {isExpanded && indicator.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {indicator.description}
                  </p>
                )}
              </TableCell>
              <TableCell>{indicator.process}</TableCell>
              <TableCell>
                {formatGoalType(indicator.goal_type)} {indicator.goal_value}
                {indicator.unit && ` ${indicator.unit}`}
              </TableCell>
              
              {months.map(({ month, year }) => {
                const value = getMeasurementValue(indicator.id, month, year);
                const goalMet = isGoalMet(value, indicator);
                
                return (
                  <TableCell 
                    key={`${indicator.id}-${year}-${month}`} 
                    className={`text-center ${value !== null ? (goalMet ? 'text-green-600' : 'text-red-600') : ''}`}
                  >
                    {value !== null 
                      ? `${value}${indicator.unit ? ` ${indicator.unit}` : ''}` 
                      : '-'}
                  </TableCell>
                );
              })}
              
              <TableCell className="text-center font-medium">
                {getSummaryValue(indicator) !== null 
                  ? `${getSummaryValue(indicator)}${indicator.unit ? ` ${indicator.unit}` : ''}` 
                  : '-'}
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(indicator)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddMeasurement(indicator)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Medição
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
