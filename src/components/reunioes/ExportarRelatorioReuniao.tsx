
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useRelatorioExport } from "./hooks/useRelatorioExport";

interface ExportarRelatorioReuniaoProps {
  reuniaoId?: string;
}

export function ExportarRelatorioReuniao({ reuniaoId }: ExportarRelatorioReuniaoProps) {
  const { loading, exportarRelatorio } = useRelatorioExport();

  const handleExport = () => exportarRelatorio(reuniaoId);

  return (
    <Button
      variant={reuniaoId ? "outline" : "default"}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          {reuniaoId ? "Exportar Ata" : "Exportar Relatório"}
        </>
      )}
    </Button>
  );
}
