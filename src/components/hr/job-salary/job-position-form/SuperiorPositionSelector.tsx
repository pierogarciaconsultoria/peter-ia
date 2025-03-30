
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface SuperiorPositionSelectorProps {
  value?: string;
  departmentFilter?: string;
  onChange: (value: string) => void;
}

interface Position {
  id: string;
  title: string;
  department: string;
}

export function SuperiorPositionSelector({ value, departmentFilter, onChange }: SuperiorPositionSelectorProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPositions() {
      setIsLoading(true);
      
      try {
        // Try to fetch positions from the database
        const { data, error } = await supabase
          .from('job_positions')
          .select('id, title, department');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPositions(data);
        } else {
          // If no data, use demo positions
          setPositions([
            { id: "1", title: "Gerente de Produção", department: "Produção" },
            { id: "2", title: "Supervisor de Produção", department: "Produção" },
            { id: "3", title: "Gerente de Qualidade", department: "Qualidade" },
            { id: "4", title: "Gerente de RH", department: "Recursos Humanos" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        // Fallback to demo data
        setPositions([
          { id: "1", title: "Gerente de Produção", department: "Produção" },
          { id: "2", title: "Supervisor de Produção", department: "Produção" },
          { id: "3", title: "Gerente de Qualidade", department: "Qualidade" },
          { id: "4", title: "Gerente de RH", department: "Recursos Humanos" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPositions();
  }, []);

  // Filter positions by department if departmentFilter is provided
  const filteredPositions = departmentFilter 
    ? positions.filter(p => p.department === departmentFilter) 
    : positions;

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um cargo superior" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Nenhum</SelectItem>
        {filteredPositions.map((position) => (
          <SelectItem key={position.id} value={position.id}>
            {position.title} ({position.department})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
