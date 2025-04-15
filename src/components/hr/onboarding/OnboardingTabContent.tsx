
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileCheck, 
  FileText, 
  ListChecks 
} from "lucide-react";
import { getStatusBadge } from "./utils";
import { OnboardingProcess } from "./types";

interface OnboardingTabContentProps {
  tabValue: "all" | "active" | "completed";
  onboardingProcesses: OnboardingProcess[];
  simpleView?: boolean;
}

export function OnboardingTabContent({ 
  tabValue, 
  onboardingProcesses,
  simpleView = false
}: OnboardingTabContentProps) {
  return (
    <div className={tabValue !== "all" ? "pt-4" : "space-y-4"}>
      <div className={`rounded-md border ${tabValue === "all" ? "mt-6" : "mt-2"}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              {!simpleView && <TableHead>Departamento</TableHead>}
              <TableHead>{tabValue === "completed" ? "Concluído em" : "Data de Início"}</TableHead>
              {!simpleView && <TableHead>Status</TableHead>}
              {tabValue !== "completed" && <TableHead>Progresso</TableHead>}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {onboardingProcesses.map((process) => (
              <TableRow key={process.id}>
                <TableCell className="font-medium">{process.employeeName}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{process.position}</span>
                    {process.position_id && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Cód: {process.position_id}
                        </span>
                        {!simpleView && process.position_details && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {process.position_details.description}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                {!simpleView && <TableCell>{process.department}</TableCell>}
                <TableCell>
                  {tabValue === "completed" 
                    ? new Date().toLocaleDateString('pt-BR')
                    : new Date(process.startDate).toLocaleDateString('pt-BR')
                  }
                </TableCell>
                {!simpleView && <TableCell>{getStatusBadge(process.status)}</TableCell>}
                {tabValue !== "completed" && (
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${process.progress}%` }}>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{process.progress}%</span>
                  </TableCell>
                )}
                <TableCell>
                  {tabValue === "completed" ? (
                    <Button variant="outline" size="sm">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Relatório
                    </Button>
                  ) : simpleView ? (
                    <Button size="sm">Ver Checklist</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <ListChecks className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
