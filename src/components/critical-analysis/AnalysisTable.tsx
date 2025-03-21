import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download, FilesIcon, Upload, Trash, Edit, Trash2 } from "lucide-react";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface AnalysisTableProps {
  analyses: CriticalAnalysisItem[];
  expandedItems: {[key: string]: boolean};
  toggleExpand: (id: string) => void;
  handleAttachmentClick: (analysisId: string) => void;
  handleViewReport: (analysis: CriticalAnalysisItem) => void;
  handleDeleteAttachment: (analysisId: string, attachmentId: string) => void;
  handleEditAnalysis: (analysis: CriticalAnalysisItem) => void;
  handleDeleteAnalysis: (analysisId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
}

export function AnalysisTable({ 
  analyses, 
  expandedItems, 
  toggleExpand, 
  handleAttachmentClick, 
  handleViewReport, 
  handleDeleteAttachment,
  handleEditAnalysis,
  handleDeleteAnalysis,
  getStatusColor,
  getStatusText,
  getFileIcon,
  formatFileSize
}: AnalysisTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);

  const openDeleteConfirmation = (analysisId: string) => {
    setAnalysisToDelete(analysisId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (analysisToDelete) {
      handleDeleteAnalysis(analysisToDelete);
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    }
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Anexos</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => (
            <React.Fragment key={analysis.id}>
              <TableRow>
                <TableCell className="whitespace-nowrap">
                  {format(analysis.date, "dd/MM/yyyy")}
                  {analysis.plannedDate && (
                    <div className="text-xs text-muted-foreground">
                      Planejada: {format(analysis.plannedDate, "dd/MM/yyyy")}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{analysis.subject}</TableCell>
                <TableCell className={getStatusColor(analysis.status)}>
                  {getStatusText(analysis.status)}
                </TableCell>
                <TableCell>{analysis.participants.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{analysis.attachments.length}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAttachmentClick(analysis.id)}
                    >
                      <Upload size={14} className="mr-1" />
                      Gerenciar
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleExpand(analysis.id)}
                    >
                      {expandedItems[analysis.id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                      {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(analysis)}
                    >
                      <FilesIcon size={14} className="mr-1" />
                      Relatório
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAnalysis(analysis)}
                    >
                      <Edit size={14} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteConfirmation(analysis.id)}
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedItems[analysis.id] && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="p-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium text-base mb-3">Requisitos para entrada da análise crítica</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">Situação de ações anteriores:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.previousActionsStatus}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Mudanças externas e internas:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.externalInternalChanges}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Desempenho e eficácia do SGQ:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.performanceInfo}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Suficiência de recursos:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.resourceSufficiency}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Eficácia de ações para riscos:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.riskActionsEffectiveness}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Oportunidades de melhoria:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.improvementOpportunities}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-base mb-3">Resultados da análise crítica</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">Oportunidades para melhoria:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.improvementResults}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Necessidade de mudanças no SGQ:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.systemChangeNeeds}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Necessidade de recursos:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.resourceNeeds}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Resultados gerais:</h4>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.results}</p>
                          </div>
                          
                          {analysis.attachments.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mt-6">Anexos:</h4>
                              <div className="mt-2 space-y-2">
                                {analysis.attachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center justify-between bg-muted p-2 rounded">
                                    <div className="flex items-center">
                                      {getFileIcon(attachment.type)}
                                      <span className="ml-2 text-sm">{attachment.name}</span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({formatFileSize(attachment.size)})
                                      </span>
                                      <Badge 
                                        variant="outline" 
                                        className={`ml-2 ${attachment.category === "input" ? "bg-blue-50" : "bg-green-50"}`}
                                      >
                                        {attachment.category === "input" ? "Requisito" : "Resultado"}
                                      </Badge>
                                    </div>
                                    <div className="flex">
                                      <Button variant="ghost" size="sm">
                                        <Download size={14} />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDeleteAttachment(analysis.id, attachment.id)}
                                      >
                                        <Trash size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir esta análise crítica? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
