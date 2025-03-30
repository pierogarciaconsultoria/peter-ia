
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { JobPosition } from "../types";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, RefreshCw, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">
              {jobPosition.title}
            </DialogTitle>
            {getStatusBadge(jobPosition.status)}
          </div>
          <p className="text-muted-foreground">
            Código: {jobPosition.code} | Revisão: {jobPosition.revision}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Informações Gerais</h3>
              <dl className="space-y-2">
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Departamento:</dt>
                  <dd>{jobPosition.department}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Data de Aprovação:</dt>
                  <dd>{jobPosition.approval_date || "Não aprovado"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Aprovador:</dt>
                  <dd>{jobPosition.approver || "Não definido"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Superior Imediato:</dt>
                  <dd>{jobPosition.immediate_supervisor_position || "Não definido"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">É superior:</dt>
                  <dd>{jobPosition.is_supervisor ? "Sim" : "Não"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Código CBO:</dt>
                  <dd>{jobPosition.cbo_code || "Não definido"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Norma:</dt>
                  <dd>{jobPosition.norm || "Não definido"}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Requisitos</h3>
              <dl className="space-y-2">
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Educação:</dt>
                  <dd>{jobPosition.education_requirements || "Não definido"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Habilidades:</dt>
                  <dd>{jobPosition.skill_requirements || "Não definido"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Treinamento:</dt>
                  <dd>{jobPosition.training_requirements || "Não definido"}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-muted-foreground">Experiência:</dt>
                  <dd>{jobPosition.experience_requirements || "Não definido"}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Principais Responsabilidades</h3>
            <p className="whitespace-pre-wrap">{jobPosition.main_responsibilities || "Não definido"}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Treinamentos Necessários</h3>
              {jobPosition.required_procedures && jobPosition.required_procedures.length > 0 ? (
                <ul className="list-disc pl-5">
                  {jobPosition.required_procedures.map((procedure, index) => (
                    <li key={index}>{procedure}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum treinamento definido</p>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Recursos Necessários</h3>
              {jobPosition.required_resources && jobPosition.required_resources.length > 0 ? (
                <ul className="list-disc pl-5">
                  {jobPosition.required_resources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum recurso definido</p>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">EPIs</h3>
              {jobPosition.required_ppe && jobPosition.required_ppe.length > 0 ? (
                <ul className="list-disc pl-5">
                  {jobPosition.required_ppe.map((ppe, index) => (
                    <li key={index}>{ppe}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum EPI definido</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-1">
            <Pencil size={16} />
            Editar
          </Button>
          <Button 
            variant="default" 
            onClick={onApprove} 
            className="gap-1 bg-green-600 hover:bg-green-700"
            disabled={jobPosition.status === "approved"}
          >
            <Check size={16} />
            Aprovar
          </Button>
          <Button 
            variant="default" 
            onClick={onRevise} 
            className="gap-1 bg-amber-600 hover:bg-amber-700"
            disabled={jobPosition.status === "in_review"}
          >
            <RefreshCw size={16} />
            Revisão
          </Button>
          <Button 
            variant="default" 
            onClick={onDistribute} 
            className="gap-1 bg-blue-600 hover:bg-blue-700"
            disabled={jobPosition.status === "distributed" || jobPosition.status !== "approved"}
          >
            <Share2 size={16} />
            Distribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
