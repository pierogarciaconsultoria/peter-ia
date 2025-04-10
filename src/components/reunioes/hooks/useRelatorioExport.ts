
import { useState } from "react";
import { toast } from "sonner";
import { exportarRelatorioGeral, exportarRelatorioReuniao } from "../utils/pdf-utils";

/**
 * Hook to handle exporting meeting reports
 */
export function useRelatorioExport() {
  const [loading, setLoading] = useState(false);

  async function exportarRelatorio(reuniaoId?: string) {
    if (loading) return;
    
    try {
      setLoading(true);
      
      // Se não tiver ID de reunião específica, exporta todas as reuniões
      if (!reuniaoId) {
        await exportarRelatorioGeral();
      } else {
        await exportarRelatorioReuniao(reuniaoId);
      }
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Não foi possível gerar o relatório");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    exportarRelatorio
  };
}
