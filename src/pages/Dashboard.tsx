
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { RequirementsList } from "@/components/RequirementsList";
import { isoRequirements } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RequirementDialog } from "@/components/requirement-dialog/RequirementDialog";
import { ChildRequirementDialog } from "@/components/ChildRequirementDialog";
import { ISORequirement } from "@/utils/isoRequirements";

export default function Dashboard() {
  const [requirements, setRequirements] = useState(isoRequirements);
  const [selectedRequirement, setSelectedRequirement] = useState<ISORequirement | null>(null);
  const [selectedChildRequirement, setSelectedChildRequirement] = useState<ISORequirement | null>(null);

  useEffect(() => {
    // In a real application, we would fetch the requirements from an API
    // For now, we're using mock data
    setRequirements(isoRequirements);
  }, []);

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <DashboardComponent requirements={requirements} />
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Requisitos da ISO 9001:2015</h2>
            <RequirementsList 
              requirements={requirements} 
              onSelectRequirement={handleCardClick} 
            />
          </div>
        </div>
      </main>

      {/* Main requirement dialog */}
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
      
      {/* Child requirement dialog */}
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
