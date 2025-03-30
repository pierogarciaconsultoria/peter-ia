
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserRound, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface OrgChartNodeProps {
  title: string;
  department: string;
  level: string;
  children?: React.ReactNode;
  isRoot?: boolean;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ 
  title, 
  department, 
  level, 
  children, 
  isRoot = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={cn(
      "flex flex-col items-center",
      isRoot ? "w-full" : "min-w-[200px]"
    )}>
      <div className="relative">
        <div className={cn(
          "flex flex-col items-center p-3 rounded-lg border bg-card shadow-sm",
          isRoot ? "bg-primary/5 border-primary/20" : ""
        )}>
          <div className="flex items-center justify-center mb-1">
            {isRoot ? (
              <Users className="h-6 w-6 text-primary mr-2" />
            ) : (
              <UserRound className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <h4 className={cn(
              "font-medium",
              isRoot ? "text-lg" : "text-base"
            )}>
              {title}
            </h4>
          </div>
          <div className="text-xs text-muted-foreground">
            {department} • {level}
          </div>
        </div>
        
        {children && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
      
      {children && isExpanded && (
        <>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex flex-col gap-6">
            <div className="w-full h-px bg-border"></div>
            <div className="flex flex-wrap justify-center gap-6">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
  parentPosition?: string | null;
}

interface DepartmentOrgChartProps {
  positions: Position[];
}

export function DepartmentOrgChart({ positions }: DepartmentOrgChartProps) {
  // Find all unique departments
  const departments = Array.from(new Set(positions.map(p => p.department)));
  
  // Group positions by department and organize by levels
  const departmentHierarchy = departments.map(department => {
    const departmentPositions = positions.filter(p => p.department === department);
    
    // Sort by level - assuming levels are Junior, Pleno, Senior
    const levelOrder = { "Junior": 1, "Pleno": 2, "Senior": 3 };
    const sortedPositions = departmentPositions.sort((a, b) => {
      return (levelOrder[b.level as keyof typeof levelOrder] || 0) - 
             (levelOrder[a.level as keyof typeof levelOrder] || 0);
    });
    
    // Find the highest level position for the department (department head)
    const departmentHead = sortedPositions[0];
    
    // Filter out the head for regular positions
    const regularPositions = sortedPositions.slice(1);
    
    return {
      department,
      head: departmentHead,
      positions: regularPositions
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Organograma da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto p-4">
          <div className="min-w-[800px] flex flex-col items-center">
            <OrgChartNode
              title="Direção"
              department="Empresa"
              level="Executivo"
              isRoot={true}
            >
              {departmentHierarchy.map(dept => (
                <OrgChartNode
                  key={dept.department}
                  title={dept.head?.title || dept.department}
                  department={dept.department}
                  level={dept.head?.level || "Gerência"}
                >
                  {dept.positions.map(position => (
                    <OrgChartNode
                      key={position.id}
                      title={position.title}
                      department={position.department}
                      level={position.level}
                    />
                  ))}
                </OrgChartNode>
              ))}
            </OrgChartNode>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
