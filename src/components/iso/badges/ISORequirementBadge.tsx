
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink } from 'lucide-react';
import { requirementToRouteMap } from '@/utils/requirementRouteMapping';
import { Link } from 'react-router-dom';

interface ISORequirementBadgeProps {
  requirementNumber: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLink?: boolean;
  className?: string;
}

export const ISORequirementBadge: React.FC<ISORequirementBadgeProps> = ({
  requirementNumber,
  size = 'md',
  showIcon = true,
  showLink = true,
  className = ''
}) => {
  const requirement = requirementToRouteMap[requirementNumber];
  
  if (!requirement) {
    return (
      <Badge variant="outline" className={`${className} text-xs`}>
        ISO {requirementNumber}
      </Badge>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const BadgeContent = () => (
    <div className="flex items-center gap-1">
      {showIcon && <FileText className="h-3 w-3" />}
      <span>ISO {requirementNumber}</span>
      {showLink && <ExternalLink className="h-3 w-3" />}
    </div>
  );

  if (showLink && requirement.route) {
    return (
      <Link to={requirement.route}>
        <Badge 
          variant="default" 
          className={`${sizeClasses[size]} ${className} hover:bg-primary/80 cursor-pointer transition-colors`}
          title={`${requirement.title} - ${requirement.description}`}
        >
          <BadgeContent />
        </Badge>
      </Link>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`${sizeClasses[size]} ${className}`}
      title={`${requirement.title} - ${requirement.description}`}
    >
      <BadgeContent />
    </Badge>
  );
};
