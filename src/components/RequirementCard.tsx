
import { FC } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { ProgressCircle } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { requirementToRouteMap } from "@/utils/requirementRouteMapping";

interface RequirementCardProps {
  requirement: ISORequirement;
  index: number;
  onClick: (requirement: ISORequirement) => void;
}

export const RequirementCard: FC<RequirementCardProps> = ({
  requirement,
  index,
  onClick,
}) => {
  // Verifica o mapeamento correspondente para este requisito
  const mappedRoute = requirementToRouteMap[requirement.number];

  return (
    <div 
      className="bg-card border rounded-lg p-6 hover:shadow-md transition duration-200 appear-animate"
      style={{ "--delay": index } as React.CSSProperties}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight">
            {requirement.number} - {requirement.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {requirement.description.length > 120 
              ? `${requirement.description.substring(0, 120)}...` 
              : requirement.description
            }
          </p>
        </div>
        <ProgressCircle 
          progress={requirement.progress} 
          size={50} 
          color="bg-green-500"
        />
      </div>

      <div className="flex justify-between mt-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onClick(requirement)}
        >
          Ver Detalhes
        </Button>
        
        {mappedRoute && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700"
            asChild
          >
            <a href={mappedRoute.route}>
              <Navigation className="h-4 w-4 mr-1" />
              Acessar {mappedRoute.title}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
