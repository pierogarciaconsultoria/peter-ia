
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BscObjective, BscMeasure } from "@/types/strategic-planning";
import { PlusCircle, ChevronDown, ChevronRight } from "lucide-react";
import { BscMeasureForm } from "./BscMeasureForm";
import { cn } from "@/lib/utils";

interface BscObjectiveCardProps {
  objective: BscObjective;
  onUpdated: () => void;
}

export function BscObjectiveCard({ objective, onUpdated }: BscObjectiveCardProps) {
  const [showMeasureDialog, setShowMeasureDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasMeasures = objective.measures && objective.measures.length > 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{objective.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
            </div>
            {hasMeasures && (
              <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </Button>
            )}
          </div>
          
          <div className={cn("pt-2", !expanded && hasMeasures && "hidden")}>
            {hasMeasures ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Indicadores</h4>
                <div className="space-y-2">
                  {objective.measures.map((measure: BscMeasure) => (
                    <div key={measure.id} className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium text-sm">{measure.name}</h5>
                        <span className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                          Meta: {measure.target} {measure.unit}
                        </span>
                      </div>
                      {measure.current_value !== undefined && (
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-muted-foreground">
                            Valor atual: {measure.current_value} {measure.unit}
                          </span>
                          <span className={cn("ml-2 text-xs rounded-full px-2", 
                            measure.current_value >= measure.target ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          )}>
                            {measure.current_value >= measure.target ? "Meta atingida" : "Em andamento"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum indicador definido para este objetivo.
              </p>
            )}
            
            <Dialog open={showMeasureDialog} onOpenChange={setShowMeasureDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Adicionar Indicador
                  <PlusCircle size={16} className="ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar indicador</DialogTitle>
                  <DialogDescription>
                    Defina um indicador de desempenho para o objetivo: {objective.title}
                  </DialogDescription>
                </DialogHeader>
                <BscMeasureForm
                  objectiveId={objective.id}
                  onSaved={() => {
                    onUpdated();
                    setShowMeasureDialog(false);
                  }}
                  onCancel={() => setShowMeasureDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {!hasMeasures && (
            <Dialog open={showMeasureDialog} onOpenChange={setShowMeasureDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Adicionar Indicador
                  <PlusCircle size={16} className="ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar indicador</DialogTitle>
                  <DialogDescription>
                    Defina um indicador de desempenho para o objetivo: {objective.title}
                  </DialogDescription>
                </DialogHeader>
                <BscMeasureForm
                  objectiveId={objective.id}
                  onSaved={() => {
                    onUpdated();
                    setShowMeasureDialog(false);
                  }}
                  onCancel={() => setShowMeasureDialog(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
