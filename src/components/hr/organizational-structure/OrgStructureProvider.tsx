
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobPosition } from "../types";

export interface JobPositionWithHierarchy extends JobPosition {
  level: string;
  parentPosition?: string | null;
  isDepartmentHead?: boolean;
}

interface OrgStructureContextType {
  positions: JobPositionWithHierarchy[];
  loading: boolean;
}

const OrgStructureContext = createContext<OrgStructureContextType>({
  positions: [],
  loading: true
});

export const useOrgStructure = () => useContext(OrgStructureContext);

interface OrgStructureProviderProps {
  children: ReactNode;
}

export function OrgStructureProvider({ children }: OrgStructureProviderProps) {
  const [positions, setPositions] = useState<JobPositionWithHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const { departments } = useDepartments();
  const { toast } = useToast();

  // Determine position level based on title
  const getPositionLevel = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('gerente') || lowerTitle.includes('diretor')) {
      return 'Senior';
    } else if (lowerTitle.includes('coordenador') || lowerTitle.includes('supervisor')) {
      return 'Pleno';
    } else {
      return 'Junior';
    }
  };

  const generatePositionsFromDepartments = (departments: any[]): JobPositionWithHierarchy[] => {
    const positions: JobPositionWithHierarchy[] = [];
    
    departments.forEach((dept) => {
      positions.push({
        id: `head-${dept.id}`,
        title: `Gerente de ${dept.name}`,
        department: dept.name,
        level: "Senior",
        isDepartmentHead: true
      });
      
      if (dept.name === "Produção" || dept.name === "Manutenção" || dept.name === "Logística") {
        positions.push({
          id: `supervisor-${dept.id}`,
          title: `Supervisor de ${dept.name}`,
          department: dept.name,
          level: "Pleno",
          parentPosition: `head-${dept.id}`
        });
        
        positions.push({
          id: `analyst-${dept.id}`,
          title: `Analista de ${dept.name}`,
          department: dept.name,
          level: "Junior",
          parentPosition: `supervisor-${dept.id}`
        });
      } else {
        positions.push({
          id: `coordinator-${dept.id}`,
          title: `Coordenador de ${dept.name}`,
          department: dept.name,
          level: "Pleno",
          parentPosition: `head-${dept.id}`
        });
        
        positions.push({
          id: `analyst-${dept.id}`,
          title: `Analista de ${dept.name}`,
          department: dept.name,
          level: "Junior",
          parentPosition: `coordinator-${dept.id}`
        });
      }
    });
    
    return positions;
  };

  // Fetch job positions from the database
  useEffect(() => {
    async function fetchJobPositions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('job_positions')
          .select('*');
        
        if (error) throw error;

        // Map database positions to our format
        const formattedPositions: JobPositionWithHierarchy[] = data.map(pos => ({
          ...pos,
          level: getPositionLevel(pos.title),
          parentPosition: pos.superior_position_id || null,
          isDepartmentHead: pos.is_department_head || false
        }));

        setPositions(formattedPositions);
      } catch (error) {
        console.error("Error fetching job positions:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do organograma.",
          variant: "destructive"
        });
        
        // Use departments to generate demo positions
        if (departments.length > 0) {
          const generatedPositions = generatePositionsFromDepartments(departments);
          setPositions(generatedPositions);
        } else {
          // Fallback to default demo positions
          setPositions([
            { id: "1", title: "Gerente de Produção", department: "Produção", level: "Senior", isDepartmentHead: true },
            { id: "2", title: "Supervisor de Produção", department: "Produção", level: "Pleno", parentPosition: "1" },
            { id: "3", title: "Analista de Produção", department: "Produção", level: "Junior", parentPosition: "2" },
            { id: "4", title: "Gerente de Qualidade", department: "Qualidade", level: "Senior", isDepartmentHead: true },
            { id: "5", title: "Analista de Qualidade", department: "Qualidade", level: "Junior", parentPosition: "4" },
            { id: "6", title: "Gerente de RH", department: "Recursos Humanos", level: "Senior", isDepartmentHead: true },
            { id: "7", title: "Analista de RH", department: "Recursos Humanos", level: "Junior", parentPosition: "6" }
          ]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchJobPositions();
  }, [departments, toast]);

  return (
    <OrgStructureContext.Provider value={{ positions, loading }}>
      {children}
    </OrgStructureContext.Provider>
  );
}
