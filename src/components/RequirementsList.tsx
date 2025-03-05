
import { ISORequirement } from "@/utils/isoRequirements";
import { RequirementCard } from "@/components/RequirementCard";

interface RequirementsListProps {
  requirements: ISORequirement[];
  onSelectRequirement: (requirement: ISORequirement) => void;
}

export function RequirementsList({ requirements, onSelectRequirement }: RequirementsListProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 appear-animate" style={{ "--delay": 1 } as React.CSSProperties}>
        ISO 9001:2015 Requirements
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requirements.map((requirement, index) => (
          <RequirementCard
            key={requirement.id}
            requirement={requirement}
            index={index + 2}
            onClick={onSelectRequirement}
          />
        ))}
      </div>
    </section>
  );
}
