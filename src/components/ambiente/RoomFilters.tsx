
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface RoomFiltersProps {
  onFilter: (search: string, type: string | null) => void;
}

export function RoomFilters({ onFilter }: RoomFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilter(value, type);
  };

  const handleTypeFilter = (newType: string | null) => {
    setType(current => current === newType ? null : newType);
    onFilter(search, current === newType ? null : newType);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar ambiente..."
          className="pl-9"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={type === 'meeting' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleTypeFilter('meeting')}
        >
          Reunião
        </Button>
        <Button
          variant={type === 'training' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('training')}
        >
          Treinamento
        </Button>
        <Button
          variant={type === 'service' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeFilter('service')}
        >
          Atendimento
        </Button>
      </div>
    </div>
  );
}
