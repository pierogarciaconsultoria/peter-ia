
import { useState } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { RequirementCard } from "@/components/RequirementCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RequirementsListProps {
  requirements: ISORequirement[];
  onSelectRequirement: (requirement: ISORequirement) => void;
}

export function RequirementsList({ requirements, onSelectRequirement }: RequirementsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRequirements = requirements.filter(req => 
    req.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h2 className="text-xl font-semibold appear-animate" style={{ "--delay": 1 } as React.CSSProperties}>
          ISO 9001:2015 Requirements
        </h2>
        <div className="relative mt-2 md:mt-0 w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredRequirements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequirements.map((requirement, index) => (
            <RequirementCard
              key={requirement.id}
              requirement={requirement}
              index={index + 2}
              onClick={onSelectRequirement}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No requirements found matching "{searchTerm}"</p>
        </div>
      )}
    </section>
  );
}
