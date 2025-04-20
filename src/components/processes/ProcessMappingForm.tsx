
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ScenarioAnalysisSection } from "./form-sections/ScenarioAnalysisSection";
import { RequirementsSection } from "./form-sections/RequirementsSection";
import { IndicatorsSection } from "./form-sections/IndicatorsSection";
import { useProcessMappingForm } from "@/hooks/useProcessMappingForm";

export interface ProcessIndicator {
  name: string;
  goal: string;
  current: string;
  generatedId?: number;
}

export interface ProcessMappingFormProps {
  onSubmit: (data: any) => void;
  initialData: any;
  isEditing: boolean;
  isSubmitting?: boolean;
}

const ProcessMappingForm: React.FC<ProcessMappingFormProps> = ({
  onSubmit,
  initialData,
  isEditing,
  isSubmitting = false
}) => {
  const { formState, formHelpers, handlers } = useProcessMappingForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name || !formState.objective || !formState.processType) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const processData = {
      ...formState,
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      risksCount: formState.risks.length,
      documentsCount: 0,
    };

    onSubmit(processData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BasicInfoSection
        name={formState.name}
        setName={handlers.setName}
        description={formState.description}
        setDescription={handlers.setDescription}
        objective={formState.objective}
        setObjective={handlers.setObjective}
        owner={formState.owner}
        setOwner={handlers.setOwner}
        status={formState.status}
        setStatus={handlers.setStatus}
        version={formState.version}
        setVersion={handlers.setVersion}
        processType={formState.processType}
        setProcessType={handlers.setProcessType}
      />

      <ScenarioAnalysisSection
        problems={formState.problems}
        risks={formState.risks}
        newProblem={formHelpers.newProblem}
        setNewProblem={formHelpers.setNewProblem}
        newRisk={formHelpers.newRisk}
        setNewRisk={formHelpers.setNewRisk}
        handleAddProblem={handlers.handleAddProblem}
        handleRemoveProblem={handlers.handleRemoveProblem}
        handleAddRisk={handlers.handleAddRisk}
        handleRemoveRisk={handlers.handleRemoveRisk}
      />

      <RequirementsSection
        entryRequirements={formState.entryRequirements}
        expectedResult={formState.expectedResult}
        newEntryRequirement={formHelpers.newEntryRequirement}
        setNewEntryRequirement={formHelpers.setNewEntryRequirement}
        setExpectedResult={handlers.setExpectedResult}
        handleAddEntryRequirement={handlers.handleAddEntryRequirement}
        handleRemoveEntryRequirement={handlers.handleRemoveEntryRequirement}
      />

      <IndicatorsSection
        indicators={formState.indicators}
        newIndicator={formHelpers.newIndicator}
        setNewIndicator={formHelpers.setNewIndicator}
        handleAddIndicator={handlers.handleAddIndicator}
        handleRemoveIndicator={handlers.handleRemoveIndicator}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Salvando..." : "Criar Processo"}
            </>
          ) : (
            isEditing ? "Salvar Alterações" : "Criar Processo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProcessMappingForm;
