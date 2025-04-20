import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlusCircle, X, Loader2, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useProcesses } from "@/hooks/useProcesses";
import { ProcessActorSelector } from "./ProcessActorSelector";
import { DocumentSelector } from "./DocumentSelector";

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
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [objective, setObjective] = useState(initialData?.objective || "");
  const [owner, setOwner] = useState(initialData?.owner || "");
  const [inputs, setInputs] = useState(initialData?.inputs || []);
  const [outputs, setOutputs] = useState(initialData?.outputs || []);
  const [activities, setActivities] = useState(initialData?.activities || []);
  const [documents, setDocuments] = useState(initialData?.documents || []);
  const [stakeholders, setStakeholders] = useState(initialData?.stakeholders || []);
  const [requirements, setRequirements] = useState(initialData?.requirements || []);
  const [risks, setRisks] = useState(initialData?.risks || []);
  const [problems, setProblems] = useState(initialData?.problems || []);
  const [entryRequirements, setEntryRequirements] = useState(initialData?.entryRequirements || []);
  const [expectedResult, setExpectedResult] = useState(initialData?.expectedResult || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [version, setVersion] = useState(initialData?.version || "1.0");
  
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [newStakeholder, setNewStakeholder] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newRisk, setNewRisk] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [newEntryRequirement, setNewEntryRequirement] = useState("");
  
  const [indicators, setIndicators] = useState<ProcessIndicator[]>(
    initialData?.indicators || []
  );
  const [newIndicator, setNewIndicator] = useState<ProcessIndicator>({
    name: "",
    goal: "",
    current: ""
  });
  const [processType, setProcessType] = useState(initialData?.type || "");
  const { processTypes } = useProcesses();

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

  const handleAddInput = () => {
    if (newInput) {
      setInputs([...inputs, { id: Date.now(), input: newInput }]);
      setNewInput("");
    }
  };

  const handleRemoveInput = (index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleAddOutput = () => {
    if (newOutput) {
      setOutputs([...outputs, { id: Date.now(), output: newOutput }]);
      setNewOutput("");
    }
  };

  const handleRemoveOutput = (index: number) => {
    const updatedOutputs = [...outputs];
    updatedOutputs.splice(index, 1);
    setOutputs(updatedOutputs);
  };

  const handleAddActivity = () => {
    if (newActivity) {
      setActivities([...activities, { id: Date.now(), activity: newActivity, actor: "" }]);
      setNewActivity("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
  };

  const handleUpdateActivityActor = (index: number, actor: string) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { ...updatedActivities[index], actor };
    setActivities(updatedActivities);
  };

  const handleAddDocument = () => {
    if (newDocument) {
      setDocuments([...documents, { id: Date.now(), document: newDocument, documentId: null }]);
      setNewDocument("");
    }
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleUpdateDocumentId = (index: number, documentId: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], documentId };
    setDocuments(updatedDocuments);
  };

  const handleAddStakeholder = () => {
    if (newStakeholder) {
      setStakeholders([...stakeholders, { id: Date.now(), stakeholder: newStakeholder }]);
      setNewStakeholder("");
    }
  };

  const handleRemoveStakeholder = (index: number) => {
    const updatedStakeholders = [...stakeholders];
    updatedStakeholders.splice(index, 1);
    setStakeholders(updatedStakeholders);
  };

  const handleAddRequirement = () => {
    if (newRequirement) {
      setRequirements([...requirements, { id: Date.now(), requirement: newRequirement }]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements.splice(index, 1);
    setRequirements(updatedRequirements);
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
        generatedId: Date.now() // Use generatedId instead of id to avoid type conflict
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
      documentsCount: documents.length,
      inputs,
      outputs,
      activities,
      documents,
      stakeholders,
      requirements,
      risks,
      problems,
      entryRequirements,
      expectedResult,
      indicators,
      type: processType
    };

    onSubmit(processData);
  };

  const FieldTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
        </TooltipTrigger>
        <TooltipContent className="bg-white p-2 shadow-lg rounded-md max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Informações Básicas do Processo
          </CardTitle>
          <CardDescription>
            Forneça as informações principais do processo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="name">Nome do Processo</Label>
                <FieldTooltip content="Nome que identifica o processo na organização" />
              </div>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Gestão de Pedidos"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="owner">Responsável</Label>
                <FieldTooltip content="Pessoa ou departamento responsável pela execução do processo" />
              </div>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Ex: Departamento Comercial"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="processType">Tipo de Processo</Label>
                <FieldTooltip content="Classifique o processo de acordo com sua função na organização" />
              </div>
              <Select
                value={processType}
                onValueChange={(value) => setProcessType(value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gestão">Gestão</SelectItem>
                  <SelectItem value="Negócio">Negócio</SelectItem>
                  <SelectItem value="Apoio">Apoio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="status">Status do Processo</Label>
                <FieldTooltip content="Estado atual do processo no ciclo de vida" />
              </div>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="pending">Pendente de Aprovação</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="version">Versão</Label>
                <FieldTooltip content="Versão atual do documento de processo" />
              </div>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="Ex: 1.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="objective">Objetivo do Processo</Label>
              <FieldTooltip content="Descreva qual o propósito deste processo e o que ele visa alcançar" />
            </div>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descreva o objetivo principal deste processo..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="description">Descrição</Label>
              <FieldTooltip content="Forneça uma descrição detalhada do processo e seu escopo" />
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito e escopo do processo..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Cenário</CardTitle>
          <CardDescription>
            Identifique problemas e riscos associados ao processo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <Label>Dores/Problemas do Processo</Label>
              <FieldTooltip content="Liste os problemas ou dificuldades enfrentados no processo" />
            </div>
            <div className="flex gap-2">
              <Input
                value={newProblem}
                onChange={(e) => setNewProblem(e.target.value)}
                placeholder="Novo problema"
              />
              <Button type="button" onClick={handleAddProblem} disabled={!newProblem}>
                Adicionar
              </Button>
            </div>
            {problems.length > 0 ? (
              <div className="border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Problema</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem, index) => (
                      <TableRow key={problem.id}>
                        <TableCell className="font-medium">{problem.problem}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProblem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Nenhum problema adicionado
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Label>Riscos Associados ao Processo</Label>
              <FieldTooltip content="Identifique os riscos potenciais que podem afetar o processo" />
            </div>
            <div className="flex gap-2">
              <Input
                value={newRisk}
                onChange={(e) => setNewRisk(e.target.value)}
                placeholder="Novo risco"
              />
              <Button type="button" onClick={handleAddRisk} disabled={!newRisk}>
                Adicionar
              </Button>
            </div>
            {risks.length > 0 ? (
              <div className="border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Risco</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.map((risk, index) => (
                      <TableRow key={risk.id}>
                        <TableCell className="font-medium">{risk.risk}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRisk(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Nenhum risco adicionado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requisitos e Resultados</CardTitle>
          <CardDescription>
            Defina os requisitos de entrada e resultados esperados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Label>Requisitos de Entrada</Label>
              <FieldTooltip content="O que é necessário para que o processo inicie" />
            </div>
            <div className="flex gap-2">
              <Input
                value={newEntryRequirement}
                onChange={(e) => setNewEntryRequirement(e.target.value)}
                placeholder="Novo requisito de entrada"
              />
              <Button 
                type="button" 
                onClick={handleAddEntryRequirement} 
                disabled={!newEntryRequirement}
              >
                Adicionar
              </Button>
            </div>
            {entryRequirements.length > 0 ? (
              <div className="border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requisito de Entrada</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entryRequirements.map((req, index) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.requirement}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEntryRequirement(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Nenhum requisito de entrada adicionado
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="expectedResult">Resultado Esperado</Label>
              <FieldTooltip content="Qual é o resultado final que se espera deste processo" />
            </div>
            <Textarea
              id="expectedResult"
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="Descreva o resultado esperado para este processo..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible defaultValue="none">
        <AccordionItem value="inputs">
          <AccordionTrigger>Entradas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newInput}
                  onChange={(e) => setNewInput(e.target.value)}
                  placeholder="Nova entrada"
                />
                <Button type="button" onClick={handleAddInput} disabled={!newInput}>
                  Adicionar
                </Button>
              </div>
              {inputs.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entrada</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inputs.map((input, index) => (
                        <TableRow key={input.id}>
                          <TableCell className="font-medium">{input.input}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInput(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhuma entrada adicionada
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="outputs">
          <AccordionTrigger>Saídas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newOutput}
                  onChange={(e) => setNewOutput(e.target.value)}
                  placeholder="Nova saída"
                />
                <Button type="button" onClick={handleAddOutput} disabled={!newOutput}>
                  Adicionar
                </Button>
              </div>
              {outputs.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Saída</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outputs.map((output, index) => (
                        <TableRow key={output.id}>
                          <TableCell className="font-medium">{output.output}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOutput(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhuma saída adicionada
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="activities">
          <AccordionTrigger>Atividades</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Nova atividade"
                />
                <Button type="button" onClick={handleAddActivity} disabled={!newActivity}>
                  Adicionar
                </Button>
              </div>
              {activities.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Atividade</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity, index) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.activity}</TableCell>
                          <TableCell>
                            <ProcessActorSelector 
                              value={activity.actor || ""}
                              onChange={(value) => handleUpdateActivityActor(index, value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveActivity(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhuma atividade adicionada
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="documents">
          <AccordionTrigger>Documentos</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  placeholder="Novo documento"
                />
                <Button type="button" onClick={handleAddDocument} disabled={!newDocument}>
                  Adicionar
                </Button>
              </div>
              {documents.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Vínculo</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document, index) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium">{document.document}</TableCell>
                          <TableCell>
                            <DocumentSelector
                              value={document.documentId || ""}
                              onChange={(value) => handleUpdateDocumentId(index, value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDocument(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhum documento adicionado
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stakeholders">
          <AccordionTrigger>Partes Interessadas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newStakeholder}
                  onChange={(e) => setNewStakeholder(e.target.value)}
                  placeholder="Nova parte interessada"
                />
                <Button type="button" onClick={handleAddStakeholder} disabled={!newStakeholder}>
                  Adicionar
                </Button>
              </div>
              {stakeholders.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parte Interessada</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stakeholders.map((stakeholder, index) => (
                        <TableRow key={stakeholder.id}>
                          <TableCell className="font-medium">{stakeholder.stakeholder}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStakeholder(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhuma parte interessada adicionada
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="requirements">
          <AccordionTrigger>Requisitos</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Novo requisito"
                />
                <Button type="button" onClick={handleAddRequirement} disabled={!newRequirement}>
                  Adicionar
                </Button>
              </div>
              {requirements.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requisito</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requirements.map((requirement, index) => (
                        <TableRow key={requirement.id}>
                          <TableCell className="font-medium">{requirement.requirement}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRequirement(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhum requisito adicionado
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risks">
          <AccordionTrigger>Riscos</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  placeholder="Novo risco"
                />
                <Button type="button" onClick={handleAddRisk} disabled={!newRisk}>
                  Adicionar
                </Button>
              </div>
              {risks.length > 0 ? (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Risco</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {risks.map((risk, index) => (
                        <TableRow key={risk.id}>
                          <TableCell className="font-medium">{risk.risk}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRisk(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhum risco adicionado
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Desempenho</CardTitle>
          <CardDescription>
            Defina os indicadores para monitorar o desempenho do processo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center">
                  <Label>Nome do Indicador</Label>
                  <FieldTooltip content="Nome que identifica o indicador" />
                </div>
                <Input
                  value={newIndicator.name}
                  onChange={(e) =>
                    setNewIndicator({ ...newIndicator, name: e.target.value })
                  }
                  placeholder="Ex: Taxa de Conversão"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <Label>Meta</Label>
                  <FieldTooltip content="Valor alvo que se deseja alcançar" />
                </div>
                <Input
                  value={newIndicator.goal}
                  onChange={(e) =>
                    setNewIndicator({ ...newIndicator, goal: e.target.value })
                  }
                  placeholder="Ex: 5%"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <Label>Situação Atual</Label>
                  <FieldTooltip content="Valor atual do indicador" />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newIndicator.current}
                    onChange={(e) =>
                      setNewIndicator({ ...newIndicator, current: e.target.value })
                    }
                    placeholder="Ex: 4.2%"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIndicator}
                    disabled={!newIndicator.name || !newIndicator.goal}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {indicators.length > 0 ? (
              <div className="border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Indicador</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Situação Atual</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {indicators.map((indicator, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{indicator.name}</TableCell>
                        <TableCell>{indicator.goal}</TableCell>
                        <TableCell>{indicator.current}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveIndicator(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Nenhum indicador adicionado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
