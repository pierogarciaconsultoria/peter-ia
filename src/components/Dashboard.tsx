
import { StatisticCard } from "@/components/StatisticCard";
import { ISORequirement } from "@/utils/isoRequirements";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardProps {
  requirements: ISORequirement[];
}

export function Dashboard({ requirements }: DashboardProps) {
  const calculateTotalProgress = () => {
    const totalRequirements = requirements.length;
    const totalProgress = requirements.reduce((sum, req) => sum + req.progress, 0);
    return Math.round(totalProgress / totalRequirements);
  };

  const countByStatus = () => {
    return {
      notStarted: requirements.filter(r => r.status === 'not-started').length,
      inProgress: requirements.filter(r => r.status === 'in-progress').length,
      review: requirements.filter(r => r.status === 'review').length,
      completed: requirements.filter(r => r.status === 'completed').length,
    };
  };

  const stats = countByStatus();

  return (
    <header className="mb-8 appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            ISO 9001:2015 Implementation
          </span>
          <h1 className="text-3xl font-bold mt-1">Quality Management System</h1>
        </div>
        <Button className="self-start">
          <Plus size={16} className="mr-2" />
          New Document
        </Button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisticCard 
          title="Progress" 
          value={calculateTotalProgress()} 
          description="Overall Progress" 
          color="bg-primary" 
        />
        
        <StatisticCard 
          title="Not Started" 
          value={stats.notStarted} 
          description="Not Started" 
          color="bg-gray-400" 
          total={requirements.length} 
        />
        
        <StatisticCard 
          title="In Progress" 
          value={stats.inProgress} 
          description="In Progress" 
          color="bg-blue-500" 
          total={requirements.length} 
        />
        
        <StatisticCard 
          title="Completed" 
          value={stats.completed} 
          description="Completed" 
          color="bg-green-500" 
          total={requirements.length} 
        />
      </div>
    </header>
  );
}
