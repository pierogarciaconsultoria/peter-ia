
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobPosition } from "../types";

export interface JobPositionWithHierarchy extends Partial<JobPosition> {
  id: string;
  title: string;
  department: string;
  level: string;
  description?: string;
  parentPosition?: string | null;
  isDepartmentHead?: boolean;
}

interface OrgStructureContextType {
  positions: JobPositionWithHierarchy[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const OrgStructureContext = createContext<OrgStructureContextType>({
  positions: [],
  loading: true,
  error: null,
  refetch: () => {}
});

export const useOrgStructure = () => useContext(OrgStructureContext);

interface OrgStructureProviderProps {
  children: ReactNode;
}

// Helper function to determine position level based on title and hierarchy
const getPositionLevel = (title: string, isDepartmentHead?: boolean, hasSuperior?: boolean): string => {
  const lowerTitle = title.toLowerCase();
  
  // Department heads are always Senior level
  if (isDepartmentHead) {
    return 'Senior';
  }
  
  // Check for explicit senior keywords
  if (lowerTitle.includes('gerente') || lowerTitle.includes('diretor') || lowerTitle.includes('coordenador geral')) {
    return 'Senior';
  }
  
  // Check for mid-level keywords
  if (lowerTitle.includes('coordenador') || lowerTitle.includes('supervisor') || lowerTitle.includes('líder')) {
    return 'Pleno';
  }
  
  // If has a superior and no clear indicators, likely Junior
  if (hasSuperior) {
    return 'Junior';
  }
  
  // Default for analysts and specialists
  return 'Junior';
};

// Generate demo positions based on real departments
const generatePositionsFromDepartments = (departments: any[]): JobPositionWithHierarchy[] => {
  const positions: JobPositionWithHierarchy[] = [];
  
  departments.forEach((dept, deptIndex) => {
    const deptName = dept.name;
    const baseId = `dept-${dept.id}`;
    
    // Department head (always Senior)
    const headId = `${baseId}-head`;
    positions.push({
      id: headId,
      title: `Gerente de ${deptName}`,
      department: deptName,
      level: "Senior",
      description: `Responsável pelo departamento de ${deptName}`,
      isDepartmentHead: true,
      parentPosition: null
    });
    
    // Add mid-level positions based on department type
    const isOperationalDept = ["Produção", "Manutenção", "Logística", "Operações"].includes(deptName);
    
    if (isOperationalDept) {
      // Supervisor level
      const supervisorId = `${baseId}-supervisor`;
      positions.push({
        id: supervisorId,
        title: `Supervisor de ${deptName}`,
        department: deptName,
        level: "Pleno",
        description: `Supervisiona as operações do departamento de ${deptName}`,
        parentPosition: headId,
        isDepartmentHead: false
      });
      
      // Analyst/Operator level
      const analystId = `${baseId}-analyst`;
      positions.push({
        id: analystId,
        title: `Operador de ${deptName}`,
        department: deptName,
        level: "Junior",
        description: `Executa atividades operacionais no departamento de ${deptName}`,
        parentPosition: supervisorId,
        isDepartmentHead: false
      });
    } else {
      // Coordinator level for administrative departments
      const coordinatorId = `${baseId}-coordinator`;
      positions.push({
        id: coordinatorId,
        title: `Coordenador de ${deptName}`,
        department: deptName,
        level: "Pleno",
        description: `Coordena as atividades do departamento de ${deptName}`,
        parentPosition: headId,
        isDepartmentHead: false
      });
      
      // Analyst level
      const analystId = `${baseId}-analyst`;
      positions.push({
        id: analystId,
        title: `Analista de ${deptName}`,
        department: deptName,
        level: "Junior",
        description: `Executa análises e processos no departamento de ${deptName}`,
        parentPosition: coordinatorId,
        isDepartmentHead: false
      });
    }
  });
  
  return positions;
};

export function OrgStructureProvider({ children }: OrgStructureProviderProps) {
  const [positions, setPositions] = useState<JobPositionWithHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { departments, isLoading: departmentsLoading } = useDepartments();
  const { toast } = useToast();

  // Fetch job positions from the database with proper joins
  const fetchJobPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('job_positions')
        .select(`
          *,
          departments!job_positions_department_fkey (
            id,
            name
          )
        `);
      
      if (error) {
        console.error("Error fetching job positions:", error);
        throw error;
      }

      if (data && data.length > 0) {
        // Map database positions to our format
        const formattedPositions: JobPositionWithHierarchy[] = data.map((pos: any) => ({
          id: pos.id,
          title: pos.title,
          department: pos.departments?.name || pos.department || 'Departamento Desconhecido',
          level: getPositionLevel(pos.title, pos.is_department_head, !!pos.superior_position_id),
          description: pos.description || `Descrição do cargo ${pos.title}`,
          parentPosition: pos.superior_position_id || null,
          isDepartmentHead: pos.is_department_head || false,
          ...pos
        }));

        console.log("Loaded job positions from database:", formattedPositions.length);
        setPositions(formattedPositions);
      } else {
        // No job positions in database, use departments to generate demo
        if (departments.length > 0) {
          console.log("No job positions found, generating from departments:", departments.length);
          const generatedPositions = generatePositionsFromDepartments(departments);
          setPositions(generatedPositions);
        } else {
          // Ultimate fallback - basic demo positions
          console.log("Using fallback demo positions");
          setPositions([
            { 
              id: "demo-1", 
              title: "Diretor Geral", 
              department: "Diretoria", 
              level: "Senior", 
              description: "Responsável pela gestão geral da empresa", 
              isDepartmentHead: true 
            },
            { 
              id: "demo-2", 
              title: "Gerente de Produção", 
              department: "Produção", 
              level: "Senior", 
              description: "Gerencia o departamento de produção", 
              isDepartmentHead: true, 
              parentPosition: "demo-1" 
            },
            { 
              id: "demo-3", 
              title: "Supervisor de Produção", 
              department: "Produção", 
              level: "Pleno", 
              description: "Supervisiona a produção", 
              parentPosition: "demo-2" 
            },
            { 
              id: "demo-4", 
              title: "Operador de Produção", 
              department: "Produção", 
              level: "Junior", 
              description: "Executa operações de produção", 
              parentPosition: "demo-3" 
            }
          ]);
        }
      }
    } catch (error: any) {
      console.error("Error in fetchJobPositions:", error);
      setError(error.message || "Erro ao carregar dados do organograma");
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do organograma. Usando dados de demonstração.",
        variant: "destructive"
      });
      
      // Even on error, try to show something useful
      if (departments.length > 0) {
        const generatedPositions = generatePositionsFromDepartments(departments);
        setPositions(generatedPositions);
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when departments are loaded
  useEffect(() => {
    if (!departmentsLoading) {
      fetchJobPositions();
    }
  }, [departments, departmentsLoading, toast]);

  const contextValue: OrgStructureContextType = {
    positions,
    loading: loading || departmentsLoading,
    error,
    refetch: fetchJobPositions
  };

  return (
    <OrgStructureContext.Provider value={contextValue}>
      {children}
    </OrgStructureContext.Provider>
  );
}
