
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { Trash } from "lucide-react";

interface ResultsSectionProps {
  improvementResults: string;
  setImprovementResults: (value: string) => void;
  systemChangeNeeds: string;
  setSystemChangeNeeds: (value: string) => void;
  resourceNeeds: string;
  setResourceNeeds: (value: string) => void;
  results: string;
  setResults: (value: string) => void;
  outputAttachments: File[];
  handleOutputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveOutputFile: (index: number) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  analysisToEdit?: CriticalAnalysisItem | null;
}

export function ResultsSection({
  improvementResults,
  setImprovementResults,
  systemChangeNeeds,
  setSystemChangeNeeds,
  resourceNeeds,
  setResourceNeeds,
  results,
  setResults,
  outputAttachments,
  handleOutputFileChange,
  handleRemoveOutputFile,
  getFileIcon,
  formatFileSize,
  analysisToEdit = null
}: ResultsSectionProps) {
  return (
    <>
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Resultados da análise crítica:</h3>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="improvementResults" className="text-right pt-2">
          Oportunidades para melhoria
        </Label>
        <Textarea
          id="improvementResults"
          value={improvementResults}
          onChange={(e) => setImprovementResults(e.target.value)}
          className="col-span-3"
          placeholder="Oportunidades para melhoria identificadas e decididas"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="systemChanges" className="text-right pt-2">
          Necessidades de mudança
        </Label>
        <Textarea
          id="systemChanges"
          value={systemChangeNeeds}
          onChange={(e) => setSystemChangeNeeds(e.target.value)}
          className="col-span-3"
          placeholder="Qualquer necessidade de mudança no sistema de gestão da qualidade"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="resourceNeeds" className="text-right pt-2">
          Necessidade de recursos
        </Label>
        <Textarea
          id="resourceNeeds"
          value={resourceNeeds}
          onChange={(e) => setResourceNeeds(e.target.value)}
          className="col-span-3"
          placeholder="Recursos necessários identificados"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="results" className="text-right pt-2">
          Resultados gerais
        </Label>
        <Textarea
          id="results"
          value={results}
          onChange={(e) => setResults(e.target.value)}
          className="col-span-3"
          placeholder="Resumo dos resultados gerais da análise crítica"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="outputAttachments" className="text-right pt-2">
          Anexos de resultados
        </Label>
        <div className="col-span-3">
          <Input
            id="outputAttachments"
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
          
          {analysisToEdit && analysisToEdit.attachments.filter(att => att.category === "output").length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium">Anexos atuais:</h4>
              <div className="mt-2 space-y-2">
                {analysisToEdit.attachments
                  .filter(att => att.category === "output")
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
