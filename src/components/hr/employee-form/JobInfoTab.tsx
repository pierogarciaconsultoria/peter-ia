import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JobPositionSelector } from "../job-position/JobPositionSelector";
import { JobPosition } from "../types";
import { DepartmentSelector } from "../departments/DepartmentSelector";
import { EmployeeFormData } from "./types";

interface JobInfoTabProps {
  formData: EmployeeFormData;
  setFormData: (data: EmployeeFormData) => void;
  selectedJobPosition: JobPosition | null;
  setSelectedJobPosition: (position: JobPosition | null) => void;
}

export function JobInfoTab({
  formData,
  setFormData,
  selectedJobPosition,
  setSelectedJobPosition,
}: JobInfoTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };

  const handleJobPositionSelect = (position: JobPosition | null) => {
    setSelectedJobPosition(position);
    if (position) {
      setFormData({
        ...formData,
        jobTitle: position.title,
        department: position.department || formData.department,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Data de Admissão</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !formData.hireDate && "text-muted-foreground"
                  )}
                >
                  {formData.hireDate ? (
                    format(formData.hireDate, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione a data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.hireDate || undefined}
                  onSelect={(date) =>
                    setFormData({ ...formData, hireDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <DepartmentSelector
              value={formData.department}
              onValueChange={handleDepartmentChange}
              placeholder="Selecione o departamento"
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição do Cargo</Label>
            <JobPositionSelector
              onSelect={handleJobPositionSelect}
              selectedPosition={selectedJobPosition}
            />
            {selectedJobPosition && (
              <div className="text-xs text-muted-foreground mt-2">
                Cargo selecionado: {selectedJobPosition.title}
                <br />
                Departamento: {selectedJobPosition.department || "N/A"}
                <br />
                Código: {selectedJobPosition.code || "N/A"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Cargo</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              readOnly={!!selectedJobPosition}
            />
            {selectedJobPosition && (
              <p className="text-xs text-muted-foreground">
                Este campo foi preenchido automaticamente com base na descrição de cargo selecionada.
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary">Salário (R$)</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              step="0.01"
              value={formData.salary}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Contato de Emergência</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
            <Input
              id="emergencyPhone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleInputChange}
            />
          </div>

          {selectedJobPosition?.description && (
            <div className="space-y-2 mt-4">
              <Label>Descrição e Requisitos do Cargo</Label>
              <div className="p-4 border rounded-md bg-muted/50 max-h-40 overflow-y-auto">
                <p className="text-sm">{selectedJobPosition.description}</p>
                {selectedJobPosition.skill_requirements && (
                  <>
                    <h4 className="font-medium mt-2 mb-1 text-sm">Requisitos:</h4>
                    <p className="text-sm">{selectedJobPosition.skill_requirements}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
