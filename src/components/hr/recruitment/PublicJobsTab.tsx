
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { JobCard } from "./JobCard";
import { JobPortalPreview } from "./JobPortalPreview";

interface PublicJobsTabProps {
  publicJobOpenings: any[];
  onCopyLink: (jobId: string) => void;
  onApply: () => void;
}

export function PublicJobsTab({ 
  publicJobOpenings, 
  onCopyLink, 
  onApply 
}: PublicJobsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Vagas Publicadas</h3>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-1" />
          Prévia do Portal de Vagas
        </Button>
      </div>
      
      {publicJobOpenings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publicJobOpenings.map(job => (
            <JobCard key={job.id} job={job} onCopyLink={onCopyLink} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">Nenhuma vaga publicada externamente.</p>
          <Button variant="outline" className="mt-4">Criar Nova Vaga Pública</Button>
        </div>
      )}
      
      <JobPortalPreview onApply={onApply} />
    </div>
  );
}
