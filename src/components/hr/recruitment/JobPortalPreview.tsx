
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { useState } from "react";

interface JobPortalPreviewProps {
  onApply: () => void;
}

export function JobPortalPreview({ onApply }: JobPortalPreviewProps) {
  const [jobApplicationDialogOpen, setJobApplicationDialogOpen] = useState(false);

  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-md border">
      <h4 className="font-medium mb-2">Prévia do Portal de Candidatura</h4>
      <div className="p-4 border rounded-md bg-background">
        <div className="p-4 border rounded-md bg-primary/5 mb-4">
          <h3 className="text-lg font-bold">Desenvolvedor React Senior</h3>
          <p className="text-sm text-muted-foreground">Departamento: Tecnologia</p>
          <div className="mt-4">
            <p className="text-sm">Estamos em busca de um desenvolvedor React Senior para atuar em projetos desafiadores...</p>
          </div>
        </div>
        
        <JobApplicationDialog
          open={jobApplicationDialogOpen}
          onOpenChange={setJobApplicationDialogOpen}
          onApply={onApply}
        />
          
        <Button className="w-full" onClick={() => setJobApplicationDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Candidatar-se
        </Button>
      </div>
    </div>
  );
}
