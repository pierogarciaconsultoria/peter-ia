
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { RequirementsList } from "@/components/RequirementsList";
import { isoRequirements } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RequirementDialog } from "@/components/requirement-dialog/RequirementDialog";
import { ChildRequirementDialog } from "@/components/child-requirement-dialog/ChildRequirementDialog";
import { ISORequirement } from "@/utils/isoRequirements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [requirements, setRequirements] = useState(isoRequirements);
  const [selectedRequirement, setSelectedRequirement] = useState<ISORequirement | null>(null);
  const [selectedChildRequirement, setSelectedChildRequirement] = useState<ISORequirement | null>(null);

  const handleCardClick = (requirement: ISORequirement) => {
    setSelectedRequirement(requirement);
  };

  const handleChildRequirementClick = (childRequirement: ISORequirement) => {
    setSelectedChildRequirement(childRequirement);
  };

  const closeRequirementDialog = () => {
    setSelectedRequirement(null);
  };

  const closeChildRequirementDialog = () => {
    setSelectedChildRequirement(null);
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-6xl mx-auto">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          <CardDescription>Acompanhamento do Sistema de Gestão da Qualidade</CardDescription>
        </CardHeader>
        
        <DashboardComponent requirements={requirements} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Requisitos da ISO 9001:2015</h2>
          <RequirementsList 
            requirements={requirements} 
            onSelectRequirement={handleCardClick} 
          />
        </div>
      </div>

      <Dialog open={!!selectedRequirement} onOpenChange={() => closeRequirementDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRequirement && (
            <RequirementDialog 
              requirement={selectedRequirement} 
              onChildRequirementClick={handleChildRequirementClick}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedChildRequirement} onOpenChange={() => closeChildRequirementDialog()}>
        <DialogContent className="max-w-2xl">
          {selectedChildRequirement && (
            <ChildRequirementDialog 
              requirement={selectedChildRequirement} 
              onClose={closeChildRequirementDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
