
import { ISORequirement } from "@/utils/isoRequirements";
import { DialogTitle } from "@/components/ui/dialog";
import { ProgressCircle } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { requirementToRouteMap } from "@/utils/requirementRouteMapping";

interface RequirementHeaderProps {
  requirement: ISORequirement;
}

export const RequirementHeader = ({ requirement }: RequirementHeaderProps) => {
  // Verifica o mapeamento correspondente para este requisito
  const mappedRoute = requirementToRouteMap[requirement.number];
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <DialogTitle className="text-xl">
          {requirement.number} - {requirement.title}
        </DialogTitle>
        <ProgressCircle 
          progress={requirement.progress} 
          size={60} 
          color="bg-green-500"
        />
      </div>
      
      <p className="text-muted-foreground mb-4">
        {requirement.description}
      </p>
      
      {mappedRoute && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 hover:text-blue-700 mt-2"
          asChild
        >
          <a href={mappedRoute.route}>
            <Navigation className="h-4 w-4 mr-1" />
            Acessar {mappedRoute.title}
          </a>
        </Button>
      )}
    </div>
  );
};
