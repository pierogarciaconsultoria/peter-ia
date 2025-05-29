import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { JobPosition } from "../types";

interface JobPositionSelectorProps {
  onSelect: (position: JobPosition | null) => void;
  selectedPosition: JobPosition | null;
}

export function JobPositionSelector({ onSelect, selectedPosition }: JobPositionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const { data, error } = await supabase
          .from('job_positions')
          .select('*');
        
        if (error) {
          throw error;
        }

        // Transform the data to match JobPosition interface
        const transformedData: JobPosition[] = (data || []).map(job => ({
          ...job,
          // Ensure status is one of the allowed literal types
          status: (['approved', 'draft', 'in_review', 'distributed'].includes(job.status) 
            ? job.status as "approved" | "draft" | "in_review" | "distributed"
            : 'draft' as const),
          // Ensure required_procedures is always a string array
          required_procedures: Array.isArray(job.required_procedures) 
            ? job.required_procedures.map(String)
            : [],
          // Ensure required_resources is always a string array
          required_resources: Array.isArray(job.required_resources)
            ? job.required_resources.map(String)
            : [],
          // Ensure required_ppe is always a string array
          required_ppe: Array.isArray(job.required_ppe)
            ? job.required_ppe.map(String)
            : []
        }));

        setJobPositions(transformedData);
      } catch (error) {
        console.error('Error fetching job positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPositions();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {selectedPosition
            ? `${selectedPosition.title} (${selectedPosition.code || 'sem código'})`
            : "Selecione um cargo..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cargo..." />
          <CommandEmpty>Nenhum cargo encontrado.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {jobPositions.map((position) => (
              <CommandItem
                key={position.id}
                value={position.title}
                onSelect={() => {
                  onSelect(position);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedPosition?.id === position.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{position.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Código: {position.code || "N/A"} | Departamento: {position.department || "N/A"}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
