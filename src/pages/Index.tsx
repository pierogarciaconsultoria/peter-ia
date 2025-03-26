
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { isoRequirements, ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dashboard } from "@/components/Dashboard";
import { RequirementsList } from "@/components/RequirementsList";
import { RequirementDialog } from "@/components/RequirementDialog";
import { ChildRequirementDialog } from "@/components/ChildRequirementDialog";

const Index = () => {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto">
          <Dashboard requirements={isoRequirements} />
          <RequirementsList 
            requirements={isoRequirements} 
            onSelectRequirement={handleCardClick} 
          />
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
      
      <Footer />
    </div>
  );
};

export default Index;
