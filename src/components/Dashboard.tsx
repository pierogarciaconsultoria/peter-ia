
import { useState } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentForm } from "@/components/DocumentForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ImplementationSchedule } from "@/components/dashboard/ImplementationSchedule";
import { MaturityMetrics } from "@/components/dashboard/MaturityMetrics";

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
    <header className="mb-8 appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
      <DashboardHeader onNewDocument={handleNewDocument} />
      
      <ImplementationSchedule />
      
      <MaturityMetrics requirements={requirements} />
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentForm document={null} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
