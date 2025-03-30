
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Link, Globe } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    department: string;
    applications: number;
    positions: number;
    description: string;
    isPublic: boolean;
  };
  onCopyLink: (jobId: string) => void;
}

export function JobCard({ job, onCopyLink }: JobCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>{job.department}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="text-sm line-clamp-3">{job.description}</p>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Vagas: {job.positions}</span>
            <span>Candidaturas: {job.applications}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 pt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onCopyLink(job.id)}
        >
          <Link className="h-4 w-4 mr-1" />
          Copiar Link
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
