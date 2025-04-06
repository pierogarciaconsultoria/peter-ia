
import { useState } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentForm } from "@/components/DocumentForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ImplementationSchedule } from "@/components/dashboard/ImplementationSchedule";
import { MaturityMetrics } from "@/components/dashboard/MaturityMetrics";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardProps {
  requirements: ISORequirement[];
}

export function Dashboard({ requirements }: DashboardProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleNewDocument = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="mb-8 appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
      <DashboardHeader onNewDocument={handleNewDocument} />
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Requisitos ISO 9001:2015</h2>
          <p className="text-muted-foreground">
            Monitoramento e controle dos requisitos da norma ISO 9001:2015, com foco na implementação
            e melhoria contínua do Sistema de Gestão da Qualidade.
          </p>
        </CardContent>
      </Card>
      
      <ImplementationSchedule />
      
      <MaturityMetrics requirements={requirements} />
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentForm document={null} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
