
import { useState } from "react";
import { Factory } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { traditionalDepartments } from "./departmentTemplates";

interface TemplateDepartmentsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddDepartment: (department: { name: string; description: string; sector: string }) => void;
}

export function TemplateDepartmentsDialog({
  isOpen,
  onOpenChange,
  onAddDepartment,
}: TemplateDepartmentsDialogProps) {
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const sectors = Array.from(
    new Set(traditionalDepartments.map((dept) => dept.sector))
  );

  const filteredDepartments = selectedSector
    ? traditionalDepartments.filter((dept) => dept.sector === selectedSector)
    : traditionalDepartments;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Factory className="mr-2 h-5 w-5" />
            Modelos de Departamentos
          </DialogTitle>
          <DialogDescription>
            Adicione rapidamente os departamentos tradicionais encontrados em indústrias
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 py-2 overflow-x-auto">
          <Button
            variant={selectedSector === null ? "default" : "outline"}
            onClick={() => setSelectedSector(null)}
            className="whitespace-nowrap"
          >
            Todos
          </Button>
          {sectors.map((sector) => (
            <Button
              key={sector}
              variant={selectedSector === sector ? "default" : "outline"}
              onClick={() => setSelectedSector(sector)}
              className="whitespace-nowrap"
            >
              {sector}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[450px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.name}
                className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <Badge variant="outline" className="mt-1">{dept.sector}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {dept.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onAddDepartment(dept);
                      toast({
                        title: "Departamento adicionado",
                        description: `O departamento ${dept.name} foi adicionado com sucesso.`,
                      });
                    }}
                    className="ml-2 h-8 gap-1"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
