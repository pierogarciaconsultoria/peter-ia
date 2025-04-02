
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSectionProps } from "./types";
import { JobPosition } from "../../types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface PositionSectionProps extends FormSectionProps {
  jobPositions: JobPosition[];
  selectedPosition?: JobPosition | null;
}

export function PositionSection({ form, jobPositions, selectedPosition }: PositionSectionProps) {
  const [showPositionDetails, setShowPositionDetails] = useState(false);
  
  // Filter job positions by selected department
  const filteredPositions = jobPositions.filter(
    job => !form.watch("department") || job.department === form.watch("department")
  );
  
  return (
    <div className="space-y-4">
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
              <Select onValueChange={field.onChange} value={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Selecione um cargo</SelectItem>
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
      
      {/* Department based on selected position */}
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <FormControl>
              <Input value={field.value} readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Job position details link */}
      {selectedPosition && (
        <div className="rounded-md bg-muted p-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-sm">Detalhes do Cargo: {selectedPosition.title}</h4>
              <p className="text-xs text-muted-foreground">
                Departamento: {selectedPosition.department || 'Não especificado'} | 
                Código: {selectedPosition.code || 'N/A'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowPositionDetails(!showPositionDetails)}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Descrição do Cargo</span>
            </Button>
          </div>
          
          {showPositionDetails && (
            <div className="mt-3 text-sm border-t pt-2">
              {selectedPosition.description ? (
                <p className="text-sm">{selectedPosition.description}</p>
              ) : (
                <p className="text-sm italic">Descrição não disponível</p>
              )}
              
              {selectedPosition.skill_requirements && (
                <div className="mt-2">
                  <h5 className="font-semibold text-xs">Requisitos:</h5>
                  <p className="text-xs">{selectedPosition.skill_requirements}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
