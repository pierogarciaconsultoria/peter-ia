
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSectionProps } from "./types";
import { JobPosition } from "../../types";

interface PositionSectionProps extends FormSectionProps {
  jobPositions: JobPosition[];
}

export function PositionSection({ form, jobPositions }: PositionSectionProps) {
  // Filter job positions by selected department
  const filteredPositions = jobPositions.filter(
    job => !form.watch("department") || job.department === form.watch("department")
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="currentPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo atual</FormLabel>
            <FormControl>
              <Input value={field.value} readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proposedPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo proposto</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredPositions.map((position) => (
                  <SelectItem key={position.id} value={position.title}>
                    {position.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
