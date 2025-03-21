
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const exportToPDF = async (
  elementRef: React.RefObject<HTMLDivElement>,
  fileName: string
) => {
  if (!elementRef.current) return;
  
  try {
    toast.info("Gerando PDF, aguarde...");
    
    const canvas = await html2canvas(elementRef.current, { 
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    let position = 0;
    
    while (position < imgHeight) {
      if (position > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        -position, 
        imgWidth, 
        imgHeight
      );
      
      position += 265;
    }
    
    pdf.save(fileName);
    toast.success("PDF gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
  }
};

export const printReport = (
  elementRef: React.RefObject<HTMLDivElement>,
  documentTitle: string
) => {
  if (!elementRef.current) return;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error("Não foi possível abrir uma nova janela para impressão");
    return;
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>${documentTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .badge { 
            display: inline-block;
            border-radius: 9999px;
            padding: 2px 8px;
            font-size: 12px;
            font-weight: 500;
            background-color: #f3f4f6;
          }
          .separator {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
          }
        </style>
      </head>
      <body>
        ${elementRef.current.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
