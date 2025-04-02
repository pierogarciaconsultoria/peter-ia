
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

interface ReportFooterProps {
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function ReportFooter({ 
  onClose, 
  onDownload, 
  onShare, 
  onDelete, 
  showDelete = false 
}: ReportFooterProps) {
  return (
    <DialogFooter className="flex justify-between sm:justify-between gap-2">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" /> Exportar PDF
        </Button>
        <Button variant="outline" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" /> Compartilhar
        </Button>
        {showDelete && onDelete && (
          <Button variant="outline" onClick={onDelete} className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Excluir
          </Button>
        )}
      </div>
      <Button onClick={onClose}>Fechar</Button>
    </DialogFooter>
  );
}
