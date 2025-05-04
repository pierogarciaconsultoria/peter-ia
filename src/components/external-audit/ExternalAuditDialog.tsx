
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { ExternalAudit, uploadAuditReport, updateExternalAudit } from "@/services/externalAuditService";
import { ExternalAuditForm } from "./ExternalAuditForm";
import { useQueryClient } from "@tanstack/react-query";

interface ExternalAuditDialogProps {
  audit: ExternalAudit | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExternalAuditDialog({ 
  audit, 
  open, 
  onClose, 
  onSuccess 
}: ExternalAuditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any) => {
    if (!audit) return;
    
    setIsSubmitting(true);
    try {
      const updated = await updateExternalAudit(audit.id, values);
      queryClient.invalidateQueries({ queryKey: ['external-audits'] });
      onSuccess();
      toast.success("Auditoria atualizada com sucesso");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar auditoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audit || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setIsUploading(true);
    
    try {
      const fileUrl = await uploadAuditReport(file, audit.id);
      const updated = await updateExternalAudit(audit.id, { report_url: fileUrl });
      queryClient.invalidateQueries({ queryKey: ['external-audits'] });
      onSuccess();
      toast.success("Relatório carregado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar o relatório");
    } finally {
      setIsUploading(false);
    }
  };

  if (!audit) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{audit.title}</DialogTitle>
          <DialogDescription>
            Gerenciar detalhes da auditoria externa
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="report">Relatório</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <ExternalAuditForm 
              defaultValues={audit} 
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="report" className="mt-4">
            <div className="space-y-6">
              <div className="rounded-md border p-6">
                <h3 className="text-lg font-medium mb-2">Relatório de Auditoria</h3>
                {audit.report_url ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium">Relatório atual:</p>
                      <a 
                        href={audit.report_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {audit.report_url}
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Para substituir o relatório atual, faça o upload de um novo arquivo.
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhum relatório foi carregado para esta auditoria.
                  </p>
                )}

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('report-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {audit.report_url ? "Substituir Relatório" : "Carregar Relatório"}
                    </Button>
                    <input
                      id="report-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formatos aceitos: PDF, DOC, DOCX
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
