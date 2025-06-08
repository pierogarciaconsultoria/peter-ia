
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, CheckSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { requirementToRouteMap } from '@/utils/requirementRouteMapping';
import { ISOComplianceIndicator } from '../badges/ISOComplianceIndicator';

interface ISORequirementPanelProps {
  requirementNumbers: string[];
  title?: string;
  className?: string;
  showActions?: boolean;
}

export const ISORequirementPanel: React.FC<ISORequirementPanelProps> = ({
  requirementNumbers,
  title = "Requisitos ISO Relacionados",
  className = '',
  showActions = true
}) => {
  if (requirementNumbers.length === 0) return null;

  const requirements = requirementNumbers
    .map(number => ({ number, ...requirementToRouteMap[number] }))
    .filter(req => req.route);

  return (
    <Card className={`border-l-4 border-l-primary ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {requirements.map((req) => (
          <div 
            key={req.number}
            className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ISO {req.number}
                </Badge>
                <span className="font-medium text-sm">{req.title}</span>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {req.description}
              </p>
              
              {/* Simulação de status de conformidade */}
              <ISOComplianceIndicator 
                status={Math.random() > 0.5 ? 'compliant' : 'pending'} 
                percentage={Math.floor(Math.random() * 100)}
              />
            </div>
            
            {showActions && (
              <div className="flex flex-col gap-1 ml-3">
                <Link to={req.route!}>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  title="Marcar como verificado"
                >
                  <CheckSquare className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <Link to="/iso-9001">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <AlertCircle className="h-3 w-3 mr-2" />
              Ver Matriz Completa de Requisitos
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
