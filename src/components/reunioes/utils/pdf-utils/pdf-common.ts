
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Formats a date to Brazilian standard format (DD/MM/YYYY)
 */
export function formatarDataPdf(dataString: string): string {
  try {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + 
      data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return dataString;
  }
}

/**
 * Adds a title to the PDF document
 */
export function adicionarTitulo(doc: jsPDF, titulo: string, y: number = 20): number {
  doc.setFontSize(18);
  doc.text(titulo, 14, y);
  return y + 10;
}

/**
 * Adds a subtitle or section header to the PDF document
 */
export function adicionarSubtitulo(doc: jsPDF, texto: string, y: number): number {
  doc.setFontSize(14);
  doc.text(texto, 14, y);
  return y + 10;
}

/**
 * Adds regular text to the PDF document
 */
export function adicionarTexto(doc: jsPDF, texto: string, y: number, tamanhoFonte: number = 12): number {
  doc.setFontSize(tamanhoFonte);
  doc.text(texto, 14, y);
  return y + 8;
}

/**
 * Checks if a new page is needed and adds one if necessary
 */
export function verificarNovaPagina(doc: jsPDF, y: number, limiteY: number = 270): number {
  if (y > limiteY) {
    doc.addPage();
    return 20;
  }
  return y;
}

/**
 * Gets the display status of an action in Portuguese
 */
export function getStatusExibicao(status?: string): string {
  switch (status) {
    case "pendente": return "Pendente";
    case "em_andamento": return "Em andamento";
    case "concluido": return "Concluído";
    case "cancelado": return "Cancelado";
    default: return status || "-";
  }
}
