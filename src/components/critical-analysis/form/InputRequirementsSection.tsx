
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { Trash } from "lucide-react";

interface InputRequirementsSectionProps {
  previousActionsStatus: string;
  setPreviousActionsStatus: (value: string) => void;
  externalInternalChanges: string;
  setExternalInternalChanges: (value: string) => void;
  performanceInfo: string;
  setPerformanceInfo: (value: string) => void;
  resourceSufficiency: string;
  setResourceSufficiency: (value: string) => void;
  riskActionsEffectiveness: string;
  setRiskActionsEffectiveness: (value: string) => void;
  improvementOpportunities: string;
  setImprovementOpportunities: (value: string) => void;
  inputAttachments: File[];
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveInputFile: (index: number) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  analysisToEdit?: CriticalAnalysisItem | null;
}

export function InputRequirementsSection({
  previousActionsStatus,
  setPreviousActionsStatus,
  externalInternalChanges,
  setExternalInternalChanges,
  performanceInfo,
  setPerformanceInfo,
  resourceSufficiency,
  setResourceSufficiency,
  riskActionsEffectiveness,
  setRiskActionsEffectiveness,
  improvementOpportunities,
  setImprovementOpportunities,
  inputAttachments,
  handleInputFileChange,
  handleRemoveInputFile,
  getFileIcon,
  formatFileSize,
  analysisToEdit = null
}: InputRequirementsSectionProps) {
  return (
    <>
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Requisitos para entrada da análise crítica:</h3>
      </div>
    
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="previousActions" className="text-right pt-2">
          Situação de ações anteriores
        </Label>
        <Textarea
          id="previousActions"
          value={previousActionsStatus}
          onChange={(e) => setPreviousActionsStatus(e.target.value)}
          className="col-span-3"
          placeholder="Situação de ações provenientes de análises críticas anteriores pela direção"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="changes" className="text-right pt-2">
          Mudanças externas e internas
        </Label>
        <Textarea
          id="changes"
          value={externalInternalChanges}
          onChange={(e) => setExternalInternalChanges(e.target.value)}
          className="col-span-3"
          placeholder="Mudanças em questões externas e internas que sejam pertinentes para o sistema de gestão da qualidade"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="performance" className="text-right pt-2">
          Informações de desempenho
        </Label>
        <Textarea
          id="performance"
          value={performanceInfo}
          onChange={(e) => setPerformanceInfo(e.target.value)}
          className="col-span-3"
          placeholder="Informação sobre o desempenho e a eficácia do sistema de gestão da qualidade, incluindo tendências"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="resources" className="text-right pt-2">
          Suficiência de recursos
        </Label>
        <Textarea
          id="resources"
          value={resourceSufficiency}
          onChange={(e) => setResourceSufficiency(e.target.value)}
          className="col-span-3"
          placeholder="Avaliação da suficiência de recursos para o sistema de gestão da qualidade"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="riskActions" className="text-right pt-2">
          Eficácia de ações para riscos
        </Label>
        <Textarea
          id="riskActions"
          value={riskActionsEffectiveness}
          onChange={(e) => setRiskActionsEffectiveness(e.target.value)}
          className="col-span-3"
          placeholder="A eficácia de ações tomadas para abordar riscos e oportunidades"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="opportunities" className="text-right pt-2">
          Oportunidades de melhoria
        </Label>
        <Textarea
          id="opportunities"
          value={improvementOpportunities}
          onChange={(e) => setImprovementOpportunities(e.target.value)}
          className="col-span-3"
          placeholder="Oportunidades de melhoria identificadas"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="inputAttachments" className="text-right pt-2">
          Anexos de requisitos
        </Label>
        <div className="col-span-3">
          <Input
            id="inputAttachments"
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
          
          {analysisToEdit && analysisToEdit.attachments.filter(att => att.category === "input").length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium">Anexos atuais:</h4>
              <div className="mt-2 space-y-2">
                {analysisToEdit.attachments
                  .filter(att => att.category === "input")
                  .map((attachment) => (
                    <div key={attachment.id} className="flex items-center bg-muted p-2 rounded">
                      <div className="flex items-center">
                        {getFileIcon(attachment.type)}
                        <span className="ml-2 text-sm">{attachment.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({formatFileSize(attachment.size)})
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
