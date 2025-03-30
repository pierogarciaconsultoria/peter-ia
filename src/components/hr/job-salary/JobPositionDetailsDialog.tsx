
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { JobPosition } from "../types";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Edit, 
  Check, 
  RefreshCw, 
  Share2, 
  ArrowRight 
} from "lucide-react";
import { ISODocument } from "@/utils/isoTypes";
import { fetchDocumentsForSelection } from "@/services/jobPositionService";

interface JobPositionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobPosition: JobPosition;
  onEdit: () => void;
  onApprove: () => void;
  onRevise: () => void;
  onDistribute: () => void;
}

export function JobPositionDetailsDialog({
  isOpen,
  onClose,
  jobPosition,
  onEdit,
  onApprove,
  onRevise,
  onDistribute,
}: JobPositionDetailsDialogProps) {
  const [documents, setDocuments] = useState<ISODocument[]>([]);

  // Fetch documents to show proper names
  useEffect(() => {
    const loadDocuments = async () => {
      if (isOpen && jobPosition.required_procedures?.length) {
        try {
          const docsData = await fetchDocumentsForSelection();
          setDocuments(docsData);
        } catch (error) {
          console.error("Error loading documents:", error);
        }
      }
    };

    loadDocuments();
  }, [isOpen, jobPosition.required_procedures]);

  // Helper function to get document title by ID
  const getDocumentTitleById = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    return document ? document.title : id;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "in_review":
        return <Badge className="bg-amber-500">Em Revisão</Badge>;
      case "distributed":
        return <Badge className="bg-blue-500">Distribuído</Badge>;
      default:
        return <Badge variant="outline">Rascunho</Badge>;
    }
  };

  if (!jobPosition) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {jobPosition.code} - {jobPosition.title}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(jobPosition.status)}
            <span className="text-sm text-muted-foreground">
              Revisão {jobPosition.revision}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description and Department */}
          <div>
            <h3 className="font-medium">Departamento</h3>
            <p className="text-sm text-muted-foreground mt-1">{jobPosition.department}</p>
          </div>
          
          <Separator />
          
          {/* Description Section */}
          <div>
            <h3 className="font-medium">Descrição</h3>
            <p className="text-sm text-muted-foreground mt-1">{jobPosition.description}</p>
          </div>
          
          <Separator />
          
          {/* Approval Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Data de Aprovação</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobPosition.approval_date || "Não aprovado"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Aprovado por</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobPosition.approver || "Não aprovado"}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Supervisor Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Superior Imediato</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobPosition.immediate_supervisor_position || "Não especificado"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">É Supervisor</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobPosition.is_supervisor ? "Sim" : "Não"}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* CBO and Norm */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Código CBO</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobPosition.cbo_code || "Não especificado"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Norma</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobPosition.norm || "Não especificado"}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Main Responsibilities */}
          {jobPosition.main_responsibilities && (
            <>
              <div>
                <h3 className="font-medium">Principais Responsabilidades</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {jobPosition.main_responsibilities}
                </p>
              </div>
              <Separator />
            </>
          )}
          
          {/* Competencies */}
          <div>
            <h3 className="font-medium">Competências</h3>
            <div className="mt-3 space-y-3">
              <div>
                <h4 className="text-sm font-medium">Educação</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {jobPosition.education_requirements || "Não especificado"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Habilidades</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {jobPosition.skill_requirements || "Não especificado"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Treinamento</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {jobPosition.training_requirements || "Não especificado"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Experiência</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {jobPosition.experience_requirements || "Não especificado"}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Required Procedures */}
          <div>
            <h3 className="font-medium">Treinamentos necessários (procedimentos)</h3>
            {jobPosition.required_procedures && jobPosition.required_procedures.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {jobPosition.required_procedures.map((procedureId) => (
                  <Badge key={procedureId} className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200">
                    <FileCheck className="w-3 h-3 mr-1" />
                    {getDocumentTitleById(procedureId)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Nenhum procedimento especificado</p>
            )}
          </div>
          
          <Separator />
          
          {/* Required Resources */}
          <div>
            <h3 className="font-medium">Recursos necessários</h3>
            {jobPosition.required_resources && jobPosition.required_resources.length > 0 ? (
              <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                {jobPosition.required_resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Nenhum recurso especificado</p>
            )}
          </div>
          
          <Separator />
          
          {/* Required PPE */}
          <div>
            <h3 className="font-medium">EPI (Equipamentos de Proteção Individual)</h3>
            {jobPosition.required_ppe && jobPosition.required_ppe.length > 0 ? (
              <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                {jobPosition.required_ppe.map((ppe, index) => (
                  <li key={index}>{ppe}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Nenhum EPI especificado</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={onEdit} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          <Button 
            onClick={onApprove} 
            disabled={jobPosition.status === "approved"} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Aprovar
          </Button>
          
          <Button 
            onClick={onRevise} 
            disabled={jobPosition.status === "in_review"} 
            variant="outline"
            className="text-amber-600 border-amber-600 hover:bg-amber-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Revisão
          </Button>
          
          <Button 
            onClick={onDistribute} 
            disabled={jobPosition.status === "distributed" || jobPosition.status !== "approved"} 
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Distribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
