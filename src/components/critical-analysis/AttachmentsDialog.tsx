
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Attachment } from "@/types/critical-analysis";
import { Trash } from "lucide-react";

interface AttachmentsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  inputAttachments: File[];
  outputAttachments: File[];
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOutputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveInputFile: (index: number) => void;
  handleRemoveOutputFile: (index: number) => void;
  handleAddAttachment: () => void;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
}

export function AttachmentsDialog({
  open,
  setOpen,
  inputAttachments,
  outputAttachments,
  handleInputFileChange,
  handleOutputFileChange,
  handleRemoveInputFile,
  handleRemoveOutputFile,
  handleAddAttachment,
  getFileIcon,
  formatFileSize
}: AttachmentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Anexos</DialogTitle>
          <DialogDescription>
            Adicione ou remova anexos para esta análise crítica.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-medium mb-2">Adicionar anexos de requisitos</h3>
            <Input
              type="file"
              multiple
              onChange={handleInputFileChange}
              className="w-full"
            />
            {inputAttachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {inputAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <span className="ml-2 text-sm">{file.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInputFile(index)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Adicionar anexos de resultados</h3>
            <Input
              type="file"
              multiple
              onChange={handleOutputFileChange}
              className="w-full"
            />
            {outputAttachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {outputAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <span className="ml-2 text-sm">{file.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOutputFile(index)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddAttachment}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
