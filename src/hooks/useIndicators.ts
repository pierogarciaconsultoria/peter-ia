
import { useState, useEffect } from "react";
import { IndicatorType, MeasurementType } from "@/types/indicators";
import {
  getAllIndicators,
  getAllMeasurements,
  addIndicator as createIndicator,
  updateIndicator,
  deleteIndicator as deleteIndicatorService
} from "@/services/indicatorService";
import { toast } from "sonner";

export function useIndicators() {
  const [indicators, setIndicators] = useState<IndicatorType[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch indicators and measurements
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, we'd fetch from the API
        const indicatorsData = await getAllIndicators();
        const measurementsData = await getAllMeasurements();
        
        setIndicators(indicatorsData);
        setMeasurements(measurementsData);
      } catch (err) {
        console.error("Error fetching indicators:", err);
        setError(err as Error);
        toast.error("Failed to load indicators");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a new indicator
  const addIndicator = async (data: Omit<IndicatorType, "id" | "created_at" | "updated_at">) => {
    try {
      const newIndicator = await createIndicator(data);
      
      setIndicators(prev => [...prev, newIndicator]);
      toast.success("Indicador criado com sucesso");
      return newIndicator;
    } catch (err) {
      console.error("Error creating indicator:", err);
      toast.error("Erro ao criar indicador");
      throw err;
    }
  };

  // Update an existing indicator
  const updateIndicator = async (id: string, data: Partial<IndicatorType>) => {
    try {
      const updatedIndicator = await updateIndicator(id, data);
      
      setIndicators(prev => 
        prev.map(indicator => 
          indicator.id === id 
            ? { 
                ...indicator, 
                ...data, 
                updated_at: new Date().toISOString() 
              } 
            : indicator
        )
      );
      
      toast.success("Indicador atualizado com sucesso");
    } catch (err) {
      console.error("Error updating indicator:", err);
      toast.error("Erro ao atualizar indicador");
      throw err;
    }
  };

  // Delete an indicator
  const deleteIndicator = async (id: string) => {
    try {
      await deleteIndicatorService(id);
      
      setIndicators(prev => prev.filter(indicator => indicator.id !== id));
      toast.success("Indicador excluído com sucesso");
    } catch (err) {
      console.error("Error deleting indicator:", err);
      toast.error("Erro ao excluir indicador");
      throw err;
    }
  };

  return {
    indicators,
    measurements,
    isLoading,
    error,
    addIndicator,
    updateIndicator,
    deleteIndicator
  };
}
