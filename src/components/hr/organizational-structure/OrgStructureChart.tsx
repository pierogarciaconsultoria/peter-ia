
import { DepartmentOrgChart } from "@/components/hr/DepartmentOrgChart";
import { useOrgStructure } from "./OrgStructureProvider";

export function OrgStructureChart() {
  const { positions, loading } = useOrgStructure();
  
  if (loading) {
    return <div className="h-96 flex items-center justify-center">Carregando organograma...</div>;
  }
  
  return <DepartmentOrgChart positions={positions} />;
}
