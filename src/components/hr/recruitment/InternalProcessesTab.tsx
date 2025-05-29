
import { JobTable } from "./JobTable";
import { getStatusBadge } from "./StatusUtils";

interface InternalProcessesTabProps {
  recruitmentProcesses: any[];
  onCopyLink: (jobId: string) => void;
}

export function InternalProcessesTab({ 
  recruitmentProcesses, 
  onCopyLink 
}: InternalProcessesTabProps) {
  return (
    <div className="space-y-6">
      <JobTable 
        jobs={recruitmentProcesses} 
        getStatusBadge={getStatusBadge} 
        onCopyLink={onCopyLink} 
      />
    </div>
  );
}
