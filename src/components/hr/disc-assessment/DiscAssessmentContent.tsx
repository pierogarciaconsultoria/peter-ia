
import { DiscAssessment } from "@/hooks/useDiscAssessments";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscAssessmentStats } from "./DiscAssessmentStats";
import { DiscAssessmentTable } from "./DiscAssessmentTable";
import { EmptyDiscAssessment } from "./EmptyDiscAssessment";

interface DiscAssessmentContentProps {
  assessments: DiscAssessment[];
  isLoading: boolean;
  onCreateAssessment: () => void;
}

export function DiscAssessmentContent({ 
  assessments,
  isLoading,
  onCreateAssessment,
}: DiscAssessmentContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (assessments.length === 0) {
    return (
      <EmptyDiscAssessment onCreateAssessment={onCreateAssessment} />
    );
  }
  
  return (
    <>
      <DiscAssessmentStats assessments={assessments} />
      <DiscAssessmentTable assessments={assessments} />
    </>
  );
}
