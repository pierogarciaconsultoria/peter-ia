
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "@/components/common/FormSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface BasicInfoSectionProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  objective: string;
  setObjective: (value: string) => void;
  owner: string;
  setOwner: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  version: string;
  setVersion: (value: string) => void;
  processType: string;
  setProcessType: (value: string) => void;
}

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

export function BasicInfoSection({
  name,
  setName,
  description,
  setDescription,
  objective,
  setObjective,
  owner,
  setOwner,
  status,
  setStatus,
  version,
  setVersion,
  processType,
  setProcessType,
}: BasicInfoSectionProps) {
  return (
    <FormSection
      title="Informações Básicas do Processo"
      description="Forneça as informações principais do processo"
    >
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
            onValueChange={setProcessType}
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
            onValueChange={setStatus}
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
    </FormSection>
  );
}
