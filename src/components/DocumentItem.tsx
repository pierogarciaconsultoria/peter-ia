
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISODocument } from "@/utils/isoTemplates";

interface DocumentItemProps {
  document: ISODocument;
}

export function DocumentItem({ document }: DocumentItemProps) {
  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <FileText className="text-blue-500" size={18} />;
      case 'procedure':
        return <FileText className="text-purple-500" size={18} />;
      case 'work-instruction':
        return <FileText className="text-amber-500" size={18} />;
      case 'form':
        return <FileText className="text-green-500" size={18} />;
      case 'record':
        return <FileText className="text-red-500" size={18} />;
      case 'manual':
        return <FileText className="text-gray-800" size={18} />;
      default:
        return <FileText className="text-gray-500" size={18} />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'policy':
        return 'Política';
      case 'procedure':
        return 'Procedimento';
      case 'work-instruction':
        return 'Instrução de Trabalho';
      case 'form':
        return 'Formulário';
      case 'record':
        return 'Registro';
      case 'manual':
        return 'Manual';
      default:
        return 'Documento';
    }
  };

  return (
    <div className="flex items-start p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 transition-colors">
      <div className="flex-shrink-0 mr-3 mt-1">
        {getDocumentTypeIcon(document.type)}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm">{document.title}</h4>
            <span className="text-xs text-muted-foreground inline-block mt-0.5">
              {getDocumentTypeLabel(document.type)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {document.description}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Visualizar">
          <Eye size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Baixar modelo">
          <Download size={16} />
        </Button>
      </div>
    </div>
  );
}
