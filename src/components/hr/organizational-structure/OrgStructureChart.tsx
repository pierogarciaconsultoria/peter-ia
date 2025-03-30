
import { DepartmentOrgChart } from "@/components/hr/DepartmentOrgChart";
import { useOrgStructure } from "./OrgStructureProvider";

export function OrgStructureChart() {
  const { positions, loading } = useOrgStructure();
  
  if (loading) {
    return <div className="h-96 flex items-center justify-center">Carregando organograma...</div>;
  }
  
  // Convert JobPositionWithHierarchy[] to match the format expected by DepartmentOrgChart
  const formattedPositions = positions.map(pos => ({
    id: pos.id,
    title: pos.title,
    department: pos.department || '',
    level: pos.level,
    parentPosition: pos.parentPosition,
    isDepartmentHead: pos.isDepartmentHead
  }));
  
  return <DepartmentOrgChart positions={formattedPositions} />;
}
