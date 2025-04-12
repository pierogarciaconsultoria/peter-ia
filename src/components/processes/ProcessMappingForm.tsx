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
import { PlusCircle, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useProcesses } from "@/hooks/useProcesses";
import { ProcessActorSelector } from "./ProcessActorSelector";
import { DocumentSelector } from "./DocumentSelector";

interface ProcessIndicator {
  name: string;
  goal: string;
  current: string;
}

interface ProcessMappingFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const ProcessMappingForm = ({ onSubmit, initialData, isEditing, onSuccess }: ProcessMappingFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [owner, setOwner] = useState(initialData?.owner || "");
  const [inputs, setInputs] = useState(initialData?.inputs || []);
  const [outputs, setOutputs] = useState(initialData?.outputs || []);
  const [activities, setActivities] = useState(initialData?.activities || []);
  const [documents, setDocuments] = useState(initialData?.documents || []);
  const [stakeholders, setStakeholders] = useState(initialData?.stakeholders || []);
  const [requirements, setRequirements] = useState(initialData?.requirements || []);
  const [risks, setRisks] = useState(initialData?.risks || []);
  
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [newStakeholder, setNewStakeholder] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newRisk, setNewRisk] = useState("");
  
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
      setOwner(initialData.owner || "");
      setInputs(initialData.inputs || []);
      setOutputs(initialData.outputs || []);
      setActivities(initialData.activities || []);
      setDocuments(initialData.documents || []);
      setStakeholders(initialData.stakeholders || []);
      setRequirements(initialData.requirements || []);
      setRisks(initialData.risks || []);
      setIndicators(initialData.indicators || []);
      setProcessType(initialData.type || "");
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

    if (!name || !description || !owner) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Criar objeto de processo com todos os dados
    const processData = {
      name,
      description,
      owner,
      status: "active",
      lastUpdated: new Date().toISOString().split("T")[0],
      risksCount: risks.length,
      documentsCount: documents.length,
      inputs,
      outputs,
      activities,
      documents,
      stakeholders,
      requirements,
      risks,
      indicators,
      type: processType
    };

    if (onSubmit) {
      onSubmit(processData);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas do Processo</CardTitle>
          <CardDescription>
            Forneça as informações principais do processo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Processo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Gestão de Pedidos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Responsável</Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Ex: Departamento Comercial"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito e escopo do processo..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="processType">Tipo de Processo</Label>
            <Select
              value={processType}
              onValueChange={(value) => setProcessType(value)}
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
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
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
                <Label>Nome do Indicador</Label>
                <Input
                  value={newIndicator.name}
                  onChange={(e) =>
                    setNewIndicator({ ...newIndicator, name: e.target.value })
                  }
                  placeholder="Ex: Taxa de Conversão"
                />
              </div>
              <div>
                <Label>Meta</Label>
                <Input
                  value={newIndicator.goal}
                  onChange={(e) =>
                    setNewIndicator({ ...newIndicator, goal: e.target.value })
                  }
                  placeholder="Ex: 5%"
                />
              </div>
              <div>
                <Label>Situação Atual</Label>
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
        <Button type="submit">
          {isEditing ? "Salvar Alterações" : "Criar Processo"}
        </Button>
      </div>
    </form>
  );
};

export default ProcessMappingForm;
