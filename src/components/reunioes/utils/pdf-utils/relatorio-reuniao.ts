
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adicionarTitulo, adicionarSubtitulo, adicionarTexto, verificarNovaPagina, getStatusExibicao, formatarDataPdf } from "./pdf-common";

/**
 * Generates a detailed report for a specific meeting
 */
export async function exportarRelatorioReuniao(id: string) {
  // Buscar detalhes da reunião
  const { data: reuniao, error: reuniaoError } = await supabase
    .from('reunioes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (reuniaoError) throw reuniaoError;
  
  // Buscar participantes
  const { data: participantesData, error: participantesError } = await supabase
    .from('reunioes_participantes')
    .select(`
      id,
      presente,
      employee:employees(name)
    `)
    .eq('reuniao_id', id);
  
  if (participantesError) throw participantesError;
  
  // Buscar registros separadamente
  const { data: registrosData, error: registrosError } = await supabase
    .from('reunioes_registros')
    .select('*')
    .eq('reuniao_id', id);
    
  if (registrosError) throw registrosError;
  
  // Combinar os dados de participantes com seus registros
  const participantes = participantesData.map(participante => {
    const employee = participante.employee as { name: string };
    const registro = registrosData?.find(r => {
      return employee && r.employee_id && 
        Object.values(participante).some(val => val === r.employee_id);
    });
    
    return {
      ...participante,
      registro: registro || undefined
    };
  });
  
  // Buscar ações
  const { data: acoes, error: acoesError } = await supabase
    .from('reunioes_acoes')
    .select(`
      titulo,
      descricao,
      prazo,
      status,
      responsavel:employees(name)
    `)
    .eq('reuniao_id', id);
  
  if (acoesError) throw acoesError;
  
  // Gerar PDF
  const doc = new jsPDF();
  
  // Cabeçalho
  let yPos = adicionarTitulo(doc, "Ata de Reunião");
  
  // Informações da reunião
  yPos = adicionarTexto(doc, `Título: ${reuniao.titulo}`, yPos + 10);
  yPos = adicionarTexto(doc, `Data e Hora: ${formatarDataPdf(reuniao.data)}`, yPos);
  
  if (reuniao.local) {
    yPos = adicionarTexto(doc, `Local: ${reuniao.local}`, yPos);
  }
  
  // Descrição
  if (reuniao.descricao) {
    yPos = adicionarTexto(doc, "Descrição:", yPos + 8);
    
    const splitDescricao = doc.splitTextToSize(reuniao.descricao, 180);
    doc.text(splitDescricao, 14, yPos);
    yPos += splitDescricao.length * 7;
  }
  
  yPos += 10;
  
  // Participantes
  yPos = adicionarSubtitulo(doc, "Participantes", yPos);
  
  const participantesPresentes = participantes?.filter(p => p.presente) || [];
  const participantesAusentes = participantes?.filter(p => !p.presente) || [];
  
  yPos = adicionarTexto(doc, `Total: ${participantes?.length || 0} (${participantesPresentes.length} presentes, ${participantesAusentes.length} ausentes)`, yPos);
  
  // Tabela de participantes
  const tableColumn = ["Nome", "Presença"];
  const tableRows = participantes?.map(p => [
    p.employee?.name || "-",
    p.presente ? "Presente" : "Ausente"
  ]) || [];
  
  // @ts-ignore
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: yPos + 10,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });
  
  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Registros individuais
  if (participantesPresentes.length > 0) {
    yPos = adicionarSubtitulo(doc, "Registros Individuais", yPos);
    
    for (const participante of participantesPresentes) {
      if (participante.registro) {
        doc.setFontSize(12);
        doc.text(`${participante.employee?.name || "Participante"}:`, 14, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        
        if (participante.registro.o_que_fiz) {
          doc.text("O que fiz:", 20, yPos);
          yPos += 6;
          const splitOQueFiz = doc.splitTextToSize(participante.registro.o_que_fiz, 170);
          doc.text(splitOQueFiz, 24, yPos);
          yPos += splitOQueFiz.length * 6 + 4;
        }
        
        if (participante.registro.o_que_vou_fazer) {
          doc.text("O que vou fazer:", 20, yPos);
          yPos += 6;
          const splitOQueVouFazer = doc.splitTextToSize(participante.registro.o_que_vou_fazer, 170);
          doc.text(splitOQueVouFazer, 24, yPos);
          yPos += splitOQueVouFazer.length * 6 + 4;
        }
        
        if (participante.registro.dificuldades) {
          doc.text("Dificuldades:", 20, yPos);
          yPos += 6;
          const splitDificuldades = doc.splitTextToSize(participante.registro.dificuldades, 170);
          doc.text(splitDificuldades, 24, yPos);
          yPos += splitDificuldades.length * 6 + 4;
        }
        
        yPos += 6;
      }
      
      // Se a página estiver ficando sem espaço, adicionar nova página
      yPos = verificarNovaPagina(doc, yPos);
    }
  }
  
  // Plano de Ação
  if (acoes && acoes.length > 0) {
    // Se a página estiver ficando sem espaço, adicionar nova página
    yPos = verificarNovaPagina(doc, yPos, 240);
    
    yPos = adicionarSubtitulo(doc, "Plano de Ação", yPos);
    
    const tableColumnAcoes = ["Ação", "Responsável", "Prazo", "Status"];
    const tableRowsAcoes = acoes.map(a => [
      a.titulo,
      a.responsavel?.name || "-",
      a.prazo ? new Date(a.prazo).toLocaleDateString('pt-BR') : "-",
      getStatusExibicao(a.status)
    ]);
    
    // @ts-ignore
    doc.autoTable({
      head: [tableColumnAcoes],
      body: tableRowsAcoes,
      startY: yPos + 10,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
  }
  
  // Salvar o arquivo
  doc.save(`ata-reuniao-${reuniao.titulo.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  
  toast.success("Ata de reunião gerada com sucesso");
}
