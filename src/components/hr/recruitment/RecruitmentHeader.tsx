
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { JobPostDialog } from "./JobPostDialog";

interface RecruitmentHeaderProps {
  isJobPostDialogOpen: boolean;
  setIsJobPostDialogOpen: (open: boolean) => void;
  onCreateJob: () => void;
}

export function RecruitmentHeader({ 
  isJobPostDialogOpen, 
  setIsJobPostDialogOpen, 
  onCreateJob 
}: RecruitmentHeaderProps) {
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-2xl font-bold">Recrutamento e Seleção</h2>
      <div className="flex gap-2">
        <JobPostDialog 
          open={isJobPostDialogOpen} 
          onOpenChange={setIsJobPostDialogOpen} 
          onCreateJob={onCreateJob} 
        />
        <Button onClick={() => setIsJobPostDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>
    </div>
  );
}
