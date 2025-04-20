import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ScenarioAnalysisSection } from "./form-sections/ScenarioAnalysisSection";
import { RequirementsSection } from "./form-sections/RequirementsSection";
import { IndicatorsSection } from "./form-sections/IndicatorsSection";
import { useProcesses } from "@/hooks/useProcesses";

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
  // Basic Info State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [objective, setObjective] = useState(initialData?.objective || "");
  const [owner, setOwner] = useState(initialData?.owner || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [version, setVersion] = useState(initialData?.version || "1.0");
  const [processType, setProcessType] = useState(initialData?.type || "");

  // Scenario Analysis State
  const [problems, setProblems] = useState(initialData?.problems || []);
  const [risks, setRisks] = useState(initialData?.risks || []);
  const [newProblem, setNewProblem] = useState("");
  const [newRisk, setNewRisk] = useState("");

  // Requirements State
  const [entryRequirements, setEntryRequirements] = useState(initialData?.entryRequirements || []);
  const [expectedResult, setExpectedResult] = useState(initialData?.expectedResult || "");
  const [newEntryRequirement, setNewEntryRequirement] = useState("");

  // Indicators State
  const [indicators, setIndicators] = useState<ProcessIndicator[]>(
    initialData?.indicators || []
  );
  const [newIndicator, setNewIndicator] = useState<ProcessIndicator>({
    name: "",
    goal: "",
    current: ""
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setObjective(initialData.objective || "");
      setOwner(initialData.owner || "");
      setInputs(initialData.inputs || []);
      setOutputs(initialData.outputs || []);
      setActivities(initialData.activities || []);
      setDocuments(initialData.documents || []);
      setStakeholders(initialData.stakeholders || []);
      setRequirements(initialData.requirements || []);
      setRisks(initialData.risks || []);
      setProblems(initialData.problems || []);
      setEntryRequirements(initialData.entryRequirements || []);
      setExpectedResult(initialData.expectedResult || "");
      setIndicators(initialData.indicators || []);
      setProcessType(initialData.type || "");
      setStatus(initialData.status || "draft");
      setVersion(initialData.version || "1.0");
    }
  }, [initialData]);

  const handleAddProblem = () => {
    if (newProblem) {
      setProblems([...problems, { id: Date.now(), problem: newProblem }]);
      setNewProblem("");
    }
  };

  const handleRemoveProblem = (index: number) => {
    const updatedProblems = [...problems];
    updatedProblems.splice(index, 1);
    setProblems(updatedProblems);
  };

  const handleAddRisk = () => {
    if (newRisk) {
      setRisks([...risks, { id: Date.now(), risk: newRisk }]);
      setNewRisk("");
    }
  };

  const handleRemoveRisk = (index: number) => {
    const updatedRisks = [...risks];
    updatedRisks.splice(index, 1);
    setRisks(updatedRisks);
  };

  const handleAddEntryRequirement = () => {
    if (newEntryRequirement) {
      setEntryRequirements([...entryRequirements, { id: Date.now(), requirement: newEntryRequirement }]);
      setNewEntryRequirement("");
    }
  };

  const handleRemoveEntryRequirement = (index: number) => {
    const updatedEntryRequirements = [...entryRequirements];
    updatedEntryRequirements.splice(index, 1);
    setEntryRequirements(updatedEntryRequirements);
  };

  const handleAddIndicator = () => {
    if (newIndicator.name && newIndicator.goal) {
      const newIndicatorWithId = { 
        ...newIndicator, 
        generatedId: Date.now()
      };
      setIndicators([...indicators, newIndicatorWithId]);
      setNewIndicator({ name: "", goal: "", current: "" });
    }
  };

  const handleRemoveIndicator = (index: number) => {
    const updatedIndicators = [...indicators];
    updatedIndicators.splice(index, 1);
    setIndicators(updatedIndicators);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !objective || !processType) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const processData = {
      name,
      description,
      objective,
      owner,
      status,
      version,
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      risksCount: risks.length,
      documentsCount: 0,
      problems,
      risks,
      entryRequirements,
      expectedResult,
      indicators,
      type: processType
    };

    onSubmit(processData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BasicInfoSection
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        objective={objective}
        setObjective={setObjective}
        owner={owner}
        setOwner={setOwner}
        status={status}
        setStatus={setStatus}
        version={version}
        setVersion={setVersion}
        processType={processType}
        setProcessType={setProcessType}
      />

      <ScenarioAnalysisSection
        problems={problems}
        risks={risks}
        newProblem={newProblem}
        setNewProblem={setNewProblem}
        newRisk={newRisk}
        setNewRisk={setNewRisk}
        handleAddProblem={handleAddProblem}
        handleRemoveProblem={handleRemoveProblem}
        handleAddRisk={handleAddRisk}
        handleRemoveRisk={handleRemoveRisk}
      />

      <RequirementsSection
        entryRequirements={entryRequirements}
        expectedResult={expectedResult}
        newEntryRequirement={newEntryRequirement}
        setNewEntryRequirement={setNewEntryRequirement}
        setExpectedResult={setExpectedResult}
        handleAddEntryRequirement={handleAddEntryRequirement}
        handleRemoveEntryRequirement={handleRemoveEntryRequirement}
      />

      <IndicatorsSection
        indicators={indicators}
        newIndicator={newIndicator}
        setNewIndicator={setNewIndicator}
        handleAddIndicator={handleAddIndicator}
        handleRemoveIndicator={handleRemoveIndicator}
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
