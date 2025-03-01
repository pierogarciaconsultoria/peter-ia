
import { ISORequirement } from "@/utils/isoRequirements";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface RequirementCardProps {
  requirement: ISORequirement;
  index: number;
  onClick: (requirement: ISORequirement) => void;
}

export function RequirementCard({ requirement, index, onClick }: RequirementCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer card-hover appear-animate overflow-hidden",
        "border border-border/40 bg-card/80 backdrop-blur-sm"
      )}
      style={{ "--delay": index } as React.CSSProperties}
      onClick={() => onClick(requirement)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
            {requirement.number}
          </span>
        </div>
        <CardTitle className="text-xl mt-2">{requirement.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {requirement.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator 
          status={requirement.status} 
          progress={requirement.progress} 
        />
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4">
        <span className="text-xs text-muted-foreground">
          {requirement.children?.length || 0} subitems
        </span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </CardFooter>
    </Card>
  );
}
