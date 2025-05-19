
import { useState, useEffect } from "react";
import { ProcessIndicator } from "@/components/processes/ProcessMappingForm";

export interface ProcessFormState {
  name: string;
  description: string;
  objective: string;
  owner: string;
  status: string;
  version: string;
  processType: string;
  problems: Array<{ id: number; problem: string }>;
  risks: Array<{ id: number; risk: string }>;
  entryRequirements: Array<{ id: number; requirement: string }>;
  expectedResult: string;
  indicators: ProcessIndicator[];
  relatedDocuments?: Array<{ id: string; title: string; document_type: string }>;
}

export interface ProcessFormHelpers {
  newProblem: string;
  setNewProblem: (value: string) => void;
  newRisk: string;
  setNewRisk: (value: string) => void;
  newEntryRequirement: string;
  setNewEntryRequirement: (value: string) => void;
  newIndicator: ProcessIndicator;
  setNewIndicator: (indicator: ProcessIndicator) => void;
  newDocument: { id: string; title: string; document_type: string };
  setNewDocument: (document: { id: string; title: string; document_type: string }) => void;
}

export const useProcessMappingForm = (initialData: any) => {
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
  
  // Related Documents State
  const [relatedDocuments, setRelatedDocuments] = useState<Array<{ id: string; title: string; document_type: string }>>(
    initialData?.relatedDocuments || []
  );
  const [newDocument, setNewDocument] = useState<{ id: string; title: string; document_type: string }>({
    id: "",
    title: "",
    document_type: ""
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setObjective(initialData.objective || "");
      setOwner(initialData.owner || "");
      setStatus(initialData.status || "draft");
      setVersion(initialData.version || "1.0");
      setProblems(initialData.problems || []);
      setRisks(initialData.risks || []);
      setEntryRequirements(initialData.entryRequirements || []);
      setExpectedResult(initialData.expectedResult || "");
      setIndicators(initialData.indicators || []);
      setProcessType(initialData.type || "");
      setRelatedDocuments(initialData.relatedDocuments || []);
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
  
  const handleAddDocument = (document: { id: string; title: string; document_type: string }) => {
    if (document && document.id) {
      setRelatedDocuments([...relatedDocuments, document]);
    }
  };
  
  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = [...relatedDocuments];
    updatedDocuments.splice(index, 1);
    setRelatedDocuments(updatedDocuments);
  };

  const formState: ProcessFormState = {
    name,
    description,
    objective,
    owner,
    status,
    version,
    processType,
    problems,
    risks,
    entryRequirements,
    expectedResult,
    indicators,
    relatedDocuments
  };

  const formHelpers: ProcessFormHelpers = {
    newProblem,
    setNewProblem,
    newRisk,
    setNewRisk,
    newEntryRequirement,
    setNewEntryRequirement,
    newIndicator,
    setNewIndicator,
    newDocument,
    setNewDocument
  };

  const handlers = {
    setName,
    setDescription,
    setObjective,
    setOwner,
    setStatus,
    setVersion,
    setProcessType,
    setExpectedResult,  // Making sure this is available in handlers
    handleAddProblem,
    handleRemoveProblem,
    handleAddRisk,
    handleRemoveRisk,
    handleAddEntryRequirement,
    handleRemoveEntryRequirement,
    handleAddIndicator,
    handleRemoveIndicator,
    handleAddDocument,
    handleRemoveDocument
  };

  return {
    formState,
    formHelpers,
    handlers
  };
};
