
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronRight, Search, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { requirementToRouteMap } from '@/utils/requirementRouteMapping';
import { Input } from '@/components/ui/input';

interface ISOQuickAccessProps {
  compact?: boolean;
  className?: string;
}

export const ISOQuickAccess: React.FC<ISOQuickAccessProps> = ({
  compact = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const requirements = Object.entries(requirementToRouteMap);
  
  const filteredRequirements = requirements.filter(([number, requirement]) =>
    number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    requirement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularRequirements = [
    '4.1', '4.4', '5.1', '6.1', '7.2', '8.2', '9.1', '9.2', '10.2'
  ];

  const displayRequirements = searchTerm 
    ? filteredRequirements 
    : requirements.filter(([number]) => popularRequirements.includes(number));

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Requisitos ISO</span>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          {displayRequirements.slice(0, 9).map(([number, requirement]) => (
            <Link 
              key={number} 
              to={requirement.route}
              className="text-xs text-center p-1 hover:bg-muted rounded transition-colors"
              title={requirement.title}
            >
              {number}
            </Link>
          ))}
        </div>
        
        <Link to="/iso-9001">
          <Button variant="outline" size="sm" className="w-full text-xs">
            Ver Todos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Acesso Rápido ISO 9001:2015
        </CardTitle>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar requisitos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {displayRequirements.map(([number, requirement]) => (
          <Link 
            key={number} 
            to={requirement.route}
            className="block p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    ISO {number}
                  </Badge>
                  <span className="font-medium text-sm">
                    {requirement.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {requirement.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
            </div>
          </Link>
        ))}
        
        {displayRequirements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum requisito encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
