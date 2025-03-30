
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileCheck } from "lucide-react";
import { JobPosition } from "../../types";
import { ISODocument } from "@/utils/isoTypes";
import { fetchDocumentsForSelection } from "@/services/jobPositionService";

interface JobPositionDetailsContentProps {
  jobPosition: JobPosition;
  isOpen: boolean;
}

export function JobPositionDetailsContent({ jobPosition, isOpen }: JobPositionDetailsContentProps) {
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
  
  return (
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

      {/* Department Head Information */}
      <div>
        <h3 className="font-medium">Responsável pelo Departamento</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {jobPosition.is_department_head ? "Sim" : "Não"}
        </p>
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
  );
}
