
import React from 'react';
import { useISOIntegration } from '@/hooks/useISOIntegration';
import { ISORequirementPanel } from './contextual/ISORequirementPanel';
import { ISORequirementBadge } from './badges/ISORequirementBadge';

interface ISOPageWrapperProps {
  children: React.ReactNode;
  showPanel?: boolean;
  showBadges?: boolean;
  customRequirements?: string[];
  className?: string;
}

export const ISOPageWrapper: React.FC<ISOPageWrapperProps> = ({
  children,
  showPanel = true,
  showBadges = true,
  customRequirements,
  className = ''
}) => {
  const { relatedRequirements, hasISORequirements } = useISOIntegration();
  
  const requirementsToShow = customRequirements || relatedRequirements;
  const shouldShowISO = requirementsToShow.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Badges dos requisitos no topo */}
      {showBadges && shouldShowISO && (
        <div className="flex flex-wrap gap-2 items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium text-primary mr-2">
            Requisitos ISO relacionados:
          </span>
          {requirementsToShow.map((requirement) => (
            <ISORequirementBadge
              key={requirement}
              requirementNumber={requirement}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Conteúdo principal da página */}
      <div className="flex gap-6">
        <div className="flex-1">
          {children}
        </div>
        
        {/* Panel lateral com requisitos ISO */}
        {showPanel && shouldShowISO && (
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-6">
              <ISORequirementPanel 
                requirementNumbers={requirementsToShow}
                title="Requisitos ISO 9001:2015"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
