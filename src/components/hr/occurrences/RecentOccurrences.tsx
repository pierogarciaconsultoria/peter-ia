
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OccurrenceWithEmployee } from "@/services/occurrenceService";
import { OccurrenceBadges } from "./OccurrenceBadges";

interface RecentOccurrencesProps {
  occurrences: OccurrenceWithEmployee[];
}

export function RecentOccurrences({ occurrences }: RecentOccurrencesProps) {
  const { getTypeBadge, getStatusBadge } = OccurrenceBadges();
  
  // Sort and limit occurrences to the 3 most recent
  const recentOccurrences = [...occurrences]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ocorrências Recentes</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentOccurrences.map(occurrence => (
          <Card key={occurrence.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={occurrence.employee.avatar_url || undefined} />
                    <AvatarFallback>{occurrence.employee.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{occurrence.employee.name}</CardTitle>
                    <CardDescription>{occurrence.employee.position}</CardDescription>
                  </div>
                </div>
                <div>
                  {getTypeBadge(occurrence.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <h4 className="font-semibold mb-2">{occurrence.title}</h4>
              <p className="text-sm">{occurrence.description}</p>
            </CardContent>
            <CardContent className="pt-0 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {new Date(occurrence.date).toLocaleDateString('pt-BR')}
              </div>
              <div>
                {getStatusBadge(occurrence.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
