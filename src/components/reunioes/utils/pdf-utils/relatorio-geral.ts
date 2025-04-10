
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adicionarTitulo, adicionarTexto, formatarDataPdf } from "./pdf-common";

/**
 * Generates a general report of all meetings
 */
export async function exportarRelatorioGeral() {
  // Buscar reuniões
  const { data: reunioes, error: reunioesError } = await supabase
    .from('reunioes')
    .select('*')
    .order('data', { ascending: false });
  
  if (reunioesError) throw reunioesError;
  
  // Gerar PDF
  const doc = new jsPDF();
  
  // Título
  let yPos = adicionarTitulo(doc, "Relatório de Reuniões");
  
  // Data de geração
  yPos = adicionarTexto(doc, `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, yPos + 10, 10);
  
  // Tabela de reuniões
  const tableColumn = ["Título", "Data", "Local", "Participantes"];
  const tableRows: any[] = [];
  
  for (const reuniao of reunioes || []) {
    // Buscar participantes
    const { data: participantes, error: participantesError } = await supabase
      .from('reunioes_participantes')
      .select('id')
      .eq('reuniao_id', reuniao.id);
    
    if (participantesError) throw participantesError;
    
    tableRows.push([
      reuniao.titulo,
      formatarDataPdf(reuniao.data),
      reuniao.local || "-",
      participantes?.length || 0
    ]);
  }
  
  // @ts-ignore
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    theme: 'striped'
  });
  
  // Salvar o arquivo
  doc.save("relatorio-reunioes.pdf");
  
  toast.success("Relatório gerado com sucesso");
}
