
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useISOIntegration } from '@/hooks/useISOIntegration';
import { ISORequirementPanel } from './contextual/ISORequirementPanel';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ISOIntegrationButtonProps {
  customRequirements?: string[];
  className?: string;
}

export const ISOIntegrationButton: React.FC<ISOIntegrationButtonProps> = ({
  customRequirements,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { relatedRequirements } = useISOIntegration();
  
  const requirementsToShow = customRequirements || relatedRequirements;
  
  if (requirementsToShow.length === 0) return null;

  return (
    <div className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            size="sm"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Requisitos ISO</span>
              <Badge variant="secondary" className="text-xs">
                {requirementsToShow.length}
              </Badge>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-3">
          <ISORequirementPanel 
            requirementNumbers={requirementsToShow}
            title="Requisitos Relacionados"
            showActions={true}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
