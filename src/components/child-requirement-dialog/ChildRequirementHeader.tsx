
import { ISORequirement } from "@/utils/isoRequirements";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ChildRequirementHeaderProps {
  requirement: ISORequirement;
  onClose: () => void;
}

export function ChildRequirementHeader({ requirement, onClose }: ChildRequirementHeaderProps) {
  return (
    <DialogHeader>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 left-2 h-8 w-8 p-0 rounded-full"
        onClick={onClose}
      >
        <ChevronLeft size={16} />
      </Button>
      <div className="flex items-center gap-2 mb-1 mt-4">
        <span className="text-sm font-medium text-primary px-3 py-0.5 bg-primary/10 rounded-full">
          {requirement.number}
        </span>
      </div>
      <DialogTitle className="text-2xl">
        {requirement.title}
      </DialogTitle>
      <DialogDescription className="text-base mt-2">
        {requirement.description}
      </DialogDescription>
    </DialogHeader>
  );
}
