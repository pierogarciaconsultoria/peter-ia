
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, LineChart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JobPositionSelector } from "../job-position/JobPositionSelector";
import { JobPosition } from "../types";
import { SalaryHistoryComponent } from "../employee/SalaryHistoryComponent";

interface JobInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedJobPosition: JobPosition | null;
  setSelectedJobPosition: (position: JobPosition | null) => void;
}

export function JobInfoTab({ 
  formData, 
  setFormData,
  selectedJobPosition,
  setSelectedJobPosition
}: JobInfoTabProps) {

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleJobPositionSelect = (position: JobPosition | null) => {
    setSelectedJobPosition(position);
    if (position) {
      setFormData((prev: any) => ({
        ...prev,
        position: position.title,
        department: position.department,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Data de Contratação</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full md:w-auto pl-3 text-left font-normal",
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
                setFormData((prev: any) => ({ ...prev, hireDate: date }))
              }
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="position">Cargo</Label>
          <JobPositionSelector
            onSelect={handleJobPositionSelect}
            selectedPosition={selectedJobPosition}
          />
        </div>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Input
          id="department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="salary">Salário</Label>
          {formData.id && (
            <SalaryHistoryComponent 
              employeeId={formData.id} 
              employeeName={`${formData.firstName} ${formData.lastName}`.trim()}
              currentSalary={parseFloat(formData.salary) || 0}
              currentPosition={formData.position}
            />
          )}
        </div>
        <Input
          id="salary"
          name="salary"
          type="number"
          step="0.01"
          value={formData.salary}
          onChange={handleInputChange}
          placeholder="0.00"
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
    </div>
  );
}
