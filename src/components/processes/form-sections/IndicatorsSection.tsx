
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, X } from "lucide-react";
import { ProcessIndicator } from "@/components/processes/ProcessMappingForm";

interface IndicatorsSectionProps {
  indicators: ProcessIndicator[];
  newIndicator: ProcessIndicator;
  setNewIndicator: (indicator: ProcessIndicator) => void;
  handleAddIndicator: () => void;
  handleRemoveIndicator: (index: number) => void;
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

export function IndicatorsSection({
  indicators,
  newIndicator,
  setNewIndicator,
  handleAddIndicator,
  handleRemoveIndicator,
}: IndicatorsSectionProps) {
  return (
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
                    <TableRow key={indicator.generatedId || index}>
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
  );
}
