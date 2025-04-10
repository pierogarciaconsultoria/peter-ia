import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportarRelatorioReuniaoProps {
  reuniaoId?: string;
}

export function ExportarRelatorioReuniao({ reuniaoId }: ExportarRelatorioReuniaoProps) {
  const [loading, setLoading] = useState(false);

  async function exportarRelatorio() {
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

  async function exportarRelatorioGeral() {
    // Buscar reuniões
    const { data: reunioes, error: reunioesError } = await supabase
      .from('reunioes')
      .select('*')
      .order('data', { ascending: false });
    
    if (reunioesError) throw reunioesError;
    
    // Gerar PDF
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text("Relatório de Reuniões", 14, 20);
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
    
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
      
      const data = new Date(reuniao.data);
      const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      tableRows.push([
        reuniao.titulo,
        dataFormatada,
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

  async function exportarRelatorioReuniao(id: string) {
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
      // Modificar esta linha - agora temos que buscar o registro por employee name
      // já que não temos o id disponível na resposta da consulta
      const registro = registrosData?.find(r => r.employee_id === participante.employee_id);
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
    doc.setFontSize(18);
    doc.text("Ata de Reunião", 14, 20);
    
    // Informações da reunião
    doc.setFontSize(12);
    doc.text(`Título: ${reuniao.titulo}`, 14, 30);
    
    const data = new Date(reuniao.data);
    const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    doc.text(`Data e Hora: ${dataFormatada}`, 14, 38);
    if (reuniao.local) doc.text(`Local: ${reuniao.local}`, 14, 46);
    
    let yPos = reuniao.local ? 54 : 46;
    
    // Descrição
    if (reuniao.descricao) {
      doc.text("Descrição:", 14, yPos);
      yPos += 8;
      
      const splitDescricao = doc.splitTextToSize(reuniao.descricao, 180);
      doc.text(splitDescricao, 14, yPos);
      yPos += splitDescricao.length * 7;
    }
    
    yPos += 10;
    
    // Participantes
    doc.setFontSize(14);
    doc.text("Participantes", 14, yPos);
    yPos += 10;
    
    const participantesPresentes = participantes?.filter(p => p.presente) || [];
    const participantesAusentes = participantes?.filter(p => !p.presente) || [];
    
    doc.setFontSize(12);
    doc.text(`Total: ${participantes?.length || 0} (${participantesPresentes.length} presentes, ${participantesAusentes.length} ausentes)`, 14, yPos);
    yPos += 10;
    
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
      startY: yPos,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
    
    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Registros individuais
    if (participantesPresentes.length > 0) {
      doc.setFontSize(14);
      doc.text("Registros Individuais", 14, yPos);
      yPos += 10;
      
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
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      }
    }
    
    // Plano de Ação
    if (acoes && acoes.length > 0) {
      // Se a página estiver ficando sem espaço, adicionar nova página
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Plano de Ação", 14, yPos);
      yPos += 10;
      
      const tableColumnAcoes = ["Ação", "Responsável", "Prazo", "Status"];
      const tableRowsAcoes = acoes.map(a => [
        a.titulo,
        a.responsavel?.name || "-",
        a.prazo ? new Date(a.prazo).toLocaleDateString('pt-BR') : "-",
        a.status === "pendente" ? "Pendente" : 
        a.status === "em_andamento" ? "Em andamento" : 
        a.status === "concluido" ? "Concluído" : 
        a.status === "cancelado" ? "Cancelado" : a.status
      ]);
      
      // @ts-ignore
      doc.autoTable({
        head: [tableColumnAcoes],
        body: tableRowsAcoes,
        startY: yPos,
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
    }
    
    // Salvar o arquivo
    doc.save(`ata-reuniao-${reuniao.titulo.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    toast.success("Ata de reunião gerada com sucesso");
  }

  return (
    <Button
      variant={reuniaoId ? "outline" : "default"}
      onClick={exportarRelatorio}
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
