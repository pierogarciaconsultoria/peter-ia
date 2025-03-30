
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, UserCheck } from "lucide-react";

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    position: string;
    score: number;
    status: string;
    avatar: string;
  };
  getStatusBadge: (status: string) => JSX.Element;
}

export function CandidateCard({ candidate, getStatusBadge }: CandidateCardProps) {
  return (
    <Card key={candidate.id}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback>{candidate.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-medium">{candidate.name}</CardTitle>
            <CardDescription>{candidate.position}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Pontuação: <span className="font-semibold">{candidate.score}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Status: {getStatusBadge(candidate.status)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-1" /> CV
            </Button>
            <Button size="sm">
              <UserCheck className="h-4 w-4 mr-1" /> Avaliar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
