
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, X } from "lucide-react";

interface ScenarioAnalysisSectionProps {
  problems: Array<{ id: number; problem: string }>;
  risks: Array<{ id: number; risk: string }>;
  newProblem: string;
  setNewProblem: (value: string) => void;
  newRisk: string;
  setNewRisk: (value: string) => void;
  handleAddProblem: () => void;
  handleRemoveProblem: (index: number) => void;
  handleAddRisk: () => void;
  handleRemoveRisk: (index: number) => void;
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

export function ScenarioAnalysisSection({
  problems,
  risks,
  newProblem,
  setNewProblem,
  newRisk,
  setNewRisk,
  handleAddProblem,
  handleRemoveProblem,
  handleAddRisk,
  handleRemoveRisk,
}: ScenarioAnalysisSectionProps) {
  return (
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
  );
}
