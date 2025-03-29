
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Action5W2H } from "@/types/actions";

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Function to get status in Portuguese
const getStatusInPortuguese = (status: string): string => {
  switch (status) {
    case 'planned': return 'Planejada';
    case 'in_progress': return 'Em andamento';
    case 'completed': return 'Concluída';
    case 'delayed': return 'Atrasada';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};

// Function to get priority in Portuguese
const getPriorityInPortuguese = (priority: string): string => {
  switch (priority) {
    case 'low': return 'Baixa';
    case 'medium': return 'Média';
    case 'high': return 'Alta';
    case 'critical': return 'Crítica';
    default: return priority;
  }
};

// Function to get process area in Portuguese
const getProcessAreaInPortuguese = (area: string): string => {
  switch (area) {
    case 'manufacturing': return 'Manufatura';
    case 'quality': return 'Qualidade';
    case 'management': return 'Gestão';
    case 'hr': return 'RH';
    case 'sales': return 'Vendas';
    case 'supply_chain': return 'Cadeia de Suprimentos';
    case 'other': return 'Outro';
    default: return area;
  }
};

export const exportActionsToPDF = async (
  actions: Action5W2H[],
  filters: { status: string; process: string; source: string }
): Promise<void> => {
  if (!actions.length) {
    toast.error("Não há ações para exportar");
    return;
  }
  
  try {
    toast.info("Gerando PDF, aguarde...");
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add company logo
    const logoImg = new Image();
    logoImg.src = 'https://www.pierogarcia.com.br/wp-content/uploads/2024/07/piero-garcia-blue.png';
    
    await new Promise<void>((resolve) => {
      logoImg.onload = () => {
        // Calculate logo size to fit in header
        const logoWidth = 60;
        const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
        
        // Position the logo in the top right
        pdf.addImage(logoImg, 'PNG', pdf.internal.pageSize.width - logoWidth - 10, 10, logoWidth, logoHeight);
        resolve();
      };
      logoImg.onerror = () => {
        console.error("Failed to load logo");
        resolve();
      };
    });
    
    // Add report title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 66, 89); // CMYK C: 85 M: 35 Y: 50 K: 25 approximated to RGB
    pdf.text('Cronograma de Ação', 15, 20);
    
    // Add date
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 15, 28);
    
    // Add filters information
    pdf.setFontSize(11);
    pdf.text('Filtros aplicados:', 15, 38);
    
    const statusFilter = filters.status === 'all' ? 'Todos' : getStatusInPortuguese(filters.status);
    const processFilter = filters.process === 'all' ? 'Todos' : getProcessAreaInPortuguese(filters.process);
    const sourceFilter = filters.source === 'all' ? 'Todos' : filters.source;
    
    pdf.setFontSize(10);
    pdf.text(`Status: ${statusFilter}`, 15, 44);
    pdf.text(`Processo: ${processFilter}`, 15, 50);
    pdf.text(`Origem: ${sourceFilter}`, 15, 56);
    
    // Add table header
    let y = 65;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, y, 180, 10, 'F');
    pdf.setTextColor(0);
    pdf.setFontSize(10);
    pdf.text('Título', 17, y + 6);
    pdf.text('Responsável', 65, y + 6);
    pdf.text('Status', 105, y + 6);
    pdf.text('Prioridade', 130, y + 6);
    pdf.text('Prazo', 160, y + 6);
    
    y += 10;
    
    // Add table content
    const pageHeight = pdf.internal.pageSize.height;
    
    for (const action of actions) {
      // Check if we need a new page
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = 20;
        
        // Re-add table header on new page
        pdf.setFillColor(240, 240, 240);
        pdf.rect(15, y, 180, 10, 'F');
        pdf.setTextColor(0);
        pdf.setFontSize(10);
        pdf.text('Título', 17, y + 6);
        pdf.text('Responsável', 65, y + 6);
        pdf.text('Status', 105, y + 6);
        pdf.text('Prioridade', 130, y + 6);
        pdf.text('Prazo', 160, y + 6);
        
        y += 10;
      }
      
      // Add alternating row background
      if ((actions.indexOf(action) % 2) === 1) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(15, y, 180, 10, 'F');
      }
      
      pdf.setTextColor(0);
      pdf.setFontSize(9);
      
      // Title - truncate if too long
      const title = action.title.length > 30 ? action.title.substring(0, 27) + '...' : action.title;
      pdf.text(title, 17, y + 6);
      
      // Responsible - truncate if too long
      const responsible = action.responsible.length > 20 ? action.responsible.substring(0, 17) + '...' : action.responsible;
      pdf.text(responsible, 65, y + 6);
      
      // Status with color
      switch (action.status) {
        case 'planned':
          pdf.setTextColor(0, 0, 200);
          break;
        case 'in_progress':
          pdf.setTextColor(200, 140, 0);
          break;
        case 'completed':
          pdf.setTextColor(0, 150, 0);
          break;
        case 'delayed':
          pdf.setTextColor(200, 0, 0);
          break;
        case 'cancelled':
          pdf.setTextColor(100, 100, 100);
          break;
      }
      
      pdf.text(getStatusInPortuguese(action.status), 105, y + 6);
      
      // Priority
      pdf.setTextColor(0);
      pdf.text(getPriorityInPortuguese(action.priority), 130, y + 6);
      
      // Due date
      pdf.text(formatDate(action.due_date), 160, y + 6);
      
      y += 10;
    }
    
    // Add footer with page numbers
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        `Página ${i} de ${totalPages} | www.pierogarcia.com.br | @pierogarciaconsultoria`,
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    pdf.save(`cronograma-de-acao-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success("PDF gerado com sucesso!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
  }
};
