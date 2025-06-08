
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { isoRequirements, ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dashboard } from "@/components/Dashboard";
import { RequirementsList } from "@/components/RequirementsList";
import { RequirementDialog } from "@/components/requirement-dialog/RequirementDialog";
import { ChildRequirementDialog } from "@/components/child-requirement-dialog/ChildRequirementDialog";
import { UserProfileInfo } from "@/components/UserProfileInfo";
import { CompanyInfoCard } from "@/components/CompanyInfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Index = () => {
  const [selectedRequirement, setSelectedRequirement] = useState<ISORequirement | null>(null);
  const [selectedChildRequirement, setSelectedChildRequirement] = useState<ISORequirement | null>(null);
  const { user, isLoading } = useCurrentUser();

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
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Informações do usuário e empresa */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <UserProfileInfo />
          <CompanyInfoCard />
        </div>
        
        <Dashboard />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Requisitos da ISO 9001:2015</h2>
          <RequirementsList 
            requirements={isoRequirements} 
            onSelectRequirement={handleCardClick} 
          />
        </div>
      </div>
      
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
