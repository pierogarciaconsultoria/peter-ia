
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, X } from "lucide-react";

interface RequirementsSectionProps {
  entryRequirements: Array<{ id: number; requirement: string }>;
  expectedResult: string;
  newEntryRequirement: string;
  setNewEntryRequirement: (value: string) => void;
  setExpectedResult: (value: string) => void;
  handleAddEntryRequirement: () => void;
  handleRemoveEntryRequirement: (index: number) => void;
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

export function RequirementsSection({
  entryRequirements,
  expectedResult,
  newEntryRequirement,
  setNewEntryRequirement,
  setExpectedResult,
  handleAddEntryRequirement,
  handleRemoveEntryRequirement,
}: RequirementsSectionProps) {
  return (
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
  );
}
