
import { CandidateCard } from "./CandidateCard";
import { getStatusBadge } from "./StatusUtils";

interface CandidatesTabProps {
  topCandidates: any[];
}

export function CandidatesTab({ topCandidates }: CandidatesTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Candidatos Destaques</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topCandidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            getStatusBadge={getStatusBadge} 
          />
        ))}
      </div>
    </div>
  );
}
