
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { StrategicIdentity } from "@/types/strategic-planning";
import { SwotItem } from "@/types/strategic-planning";
import { BscPerspective } from "@/types/strategic-planning";
import { BusinessModelCanvas } from "@/types/strategic-planning";
import { toast } from "sonner";

export const exportStrategicPlanningToPDF = async (
  identity: StrategicIdentity | null,
  swotItems: SwotItem[] | null,
  bscPerspectives: BscPerspective[] | null,
  businessCanvas: BusinessModelCanvas | null
): Promise<void> => {
  try {
    toast.info("Gerando PDF, aguarde...");
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 66, 89);
    pdf.text('Planejamento Estratégico', pdf.internal.pageSize.width / 2, 20, { align: 'center' });
    
    // Add date
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, pdf.internal.pageSize.width / 2, 28, { align: 'center' });
    
    // Starting position for content
    let y = 40;
    
    // Add Identity section
    if (identity) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 66, 89);
      pdf.text('Identidade Estratégica', 14, y);
      y += 8;
      
      // Mission
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.text('Missão:', 14, y);
      y += 6;
      
      pdf.setFontSize(10);
      const missionLines = pdf.splitTextToSize(identity.mission || "Não definida", pdf.internal.pageSize.width - 28);
      pdf.text(missionLines, 14, y);
      y += missionLines.length * 5 + 5;
      
      // Vision
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.text('Visão:', 14, y);
      y += 6;
      
      pdf.setFontSize(10);
      const visionLines = pdf.splitTextToSize(identity.vision || "Não definida", pdf.internal.pageSize.width - 28);
      pdf.text(visionLines, 14, y);
      y += visionLines.length * 5 + 5;
      
      // Values
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.text('Valores:', 14, y);
      y += 6;
      
      pdf.setFontSize(10);
      if (identity.values && identity.values.length > 0) {
        identity.values.forEach(value => {
          pdf.text(`• ${value}`, 14, y);
          y += 5;
        });
      } else {
        pdf.text("Nenhum valor definido", 14, y);
        y += 5;
      }
      
      y += 10;
    }
    
    // Check if we need a new page
    if (y > pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      y = 20;
    }
    
    // Add SWOT Analysis section
    if (swotItems && swotItems.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 66, 89);
      pdf.text('Análise SWOT', 14, y);
      y += 10;
      
      // Create SWOT grid
      const categories = ['strength', 'weakness', 'opportunity', 'threat'];
      const categoryNames = {
        strength: 'Forças',
        weakness: 'Fraquezas',
        opportunity: 'Oportunidades',
        threat: 'Ameaças'
      };
      
      // Calculate positions for 2x2 grid
      const pageWidth = pdf.internal.pageSize.width;
      const colWidth = (pageWidth - 28) / 2;
      
      for (let i = 0; i < categories.length; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 14 + col * colWidth;
        const yStart = y + row * 60;
        
        // Category title
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        pdf.text(categoryNames[categories[i] as keyof typeof categoryNames], x, yStart);
        
        // Category items
        pdf.setFontSize(9);
        let itemY = yStart + 6;
        const categoryItems = swotItems.filter(item => item.category === categories[i]);
        
        if (categoryItems.length > 0) {
          categoryItems.forEach(item => {
            const itemLines = pdf.splitTextToSize(`• ${item.description} (Impacto: ${item.impact_level}/5)`, colWidth - 5);
            pdf.text(itemLines, x, itemY);
            itemY += itemLines.length * 4 + 2;
          });
        } else {
          pdf.text("Nenhum item cadastrado", x, itemY);
        }
      }
      
      y += 130; // Adjust based on SWOT grid height
      
      // Add a new page after SWOT
      pdf.addPage();
      y = 20;
    }
    
    // Add BSC section
    if (bscPerspectives && bscPerspectives.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 66, 89);
      pdf.text('Balanced Scorecard', 14, y);
      y += 10;
      
      const perspectiveNames = {
        financial: 'Financeira',
        customer: 'Clientes',
        internal_process: 'Processos Internos',
        learning_growth: 'Aprendizado e Crescimento'
      };
      
      bscPerspectives.forEach(perspective => {
        // Check if we need a new page
        if (y > pdf.internal.pageSize.height - 40) {
          pdf.addPage();
          y = 20;
        }
        
        // Perspective name
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        pdf.text(`Perspectiva: ${perspectiveNames[perspective.perspective as keyof typeof perspectiveNames]}`, 14, y);
        y += 8;
        
        if (perspective.objectives && perspective.objectives.length > 0) {
          perspective.objectives.forEach(objective => {
            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            pdf.text(`Objetivo: ${objective.title}`, 14, y);
            y += 5;
            
            const descLines = pdf.splitTextToSize(`Descrição: ${objective.description}`, pdf.internal.pageSize.width - 28);
            pdf.text(descLines, 14, y);
            y += descLines.length * 5;
            
            if (objective.measures && objective.measures.length > 0) {
              pdf.text("Indicadores:", 14, y);
              y += 5;
              
              objective.measures.forEach(measure => {
                pdf.text(`• ${measure.name} (Meta: ${measure.target} ${measure.unit}, Atual: ${measure.current_value || 'N/A'} ${measure.unit})`, 20, y);
                y += 5;
              });
            }
            
            y += 5;
          });
        } else {
          pdf.setFontSize(10);
          pdf.text("Nenhum objetivo cadastrado", 14, y);
          y += 5;
        }
        
        y += 5;
      });
      
      // Add a new page after BSC
      pdf.addPage();
      y = 20;
    }
    
    // Add Business Model Canvas
    if (businessCanvas) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 66, 89);
      pdf.text('Business Model Canvas', 14, y);
      y += 10;
      
      const canvasSections = [
        { title: 'Parcerias Principais', content: businessCanvas.key_partners },
        { title: 'Atividades Principais', content: businessCanvas.key_activities },
        { title: 'Recursos Principais', content: businessCanvas.key_resources },
        { title: 'Proposta de Valor', content: businessCanvas.value_propositions },
        { title: 'Relacionamento com Clientes', content: businessCanvas.customer_relationships },
        { title: 'Canais', content: businessCanvas.channels },
        { title: 'Segmentos de Clientes', content: businessCanvas.customer_segments },
        { title: 'Estrutura de Custos', content: businessCanvas.cost_structure },
        { title: 'Fontes de Receita', content: businessCanvas.revenue_streams }
      ];
      
      for (const section of canvasSections) {
        // Check if we need a new page
        if (y > pdf.internal.pageSize.height - 30) {
          pdf.addPage();
          y = 20;
        }
        
        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);
        pdf.text(section.title, 14, y);
        y += 6;
        
        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        const contentLines = pdf.splitTextToSize(section.content || "Não definido", pdf.internal.pageSize.width - 28);
        pdf.text(contentLines, 14, y);
        y += contentLines.length * 4 + 6;
      }
    }
    
    // Add footer with page numbers
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        `Página ${i} de ${totalPages} | Planejamento Estratégico`,
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    pdf.save(`planejamento-estrategico-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success("Relatório gerado com sucesso!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
  }
};
