
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { RequestFormValues } from "./types";
import { RequestFormDialogProps } from "./form/types";
import { MovementTypeSelector, movementTypes } from "./form/MovementTypeSelector";
import { EmployeeSection } from "./form/EmployeeSection";
import { PositionSection } from "./form/PositionSection";
import { ScheduleSection } from "./form/ScheduleSection";
import { AdmissionSection } from "./form/AdmissionSection";
import { TerminationSection } from "./form/TerminationSection";
import { SalarySection } from "./form/SalarySection";
import { JustificationSection } from "./form/JustificationSection";
import { SignatureSection } from "./form/SignatureSection";
import { useEmployeeData } from "./form/useEmployeeData";

export function RequestFormDialog({ isOpen, onOpenChange, onSubmit, jobPositions }: RequestFormDialogProps) {
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position_id: "",
      justification: "",
      targetDate: "",
      employeeName: "",
      employeeId: "",
      hireDate: "",
      currentPosition: "",
      proposedPosition: "",
      currentSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      proposedSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      currentSalary: "",
      proposedSalary: "",
      days: "",
      gender: undefined,
      admissionType: "",
      terminationType: "",
      justCause: false,
      noticePeriod: false
    }
  });
  
  // Use the employee data hook
  useEmployeeData(form, jobPositions);

  // Selected type category
  const selectedType = movementTypes.find(type => type.id === form.watch("type"))?.label || "";
  const isAdmission = selectedType === "Admissão";
  const isTermination = selectedType === "Demissão";
  const isSalaryChange = selectedType === "Aumento salarial";
  const isPositionChange = selectedType === "Mudança de cargo";
  const isScheduleChange = selectedType === "Mudança de horário";

  const showPositionSection = isAdmission || isPositionChange || isSalaryChange;
  const showScheduleSection = isAdmission || isScheduleChange;
  const showSalarySection = isAdmission || isSalaryChange;
  const showAdmissionSection = isAdmission;
  const showTerminationSection = isTermination;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Movimentação de Pessoal</DialogTitle>
          <DialogDescription>
            Formulário para solicitação de movimentação de pessoal
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Movement Type Selection */}
            <MovementTypeSelector form={form} />

            {/* Employee Section */}
            <EmployeeSection form={form} />

            {/* Position Section - conditionally shown */}
            {showPositionSection && (
              <PositionSection form={form} jobPositions={jobPositions} />
            )}

            {/* Schedule Section - conditionally shown */}
            {showScheduleSection && (
              <ScheduleSection form={form} />
            )}

            {/* Admission Section - conditionally shown */}
            {showAdmissionSection && (
              <AdmissionSection form={form} />
            )}

            {/* Termination Section - conditionally shown */}
            {showTerminationSection && (
              <TerminationSection form={form} />
            )}

            {/* Salary Section - conditionally shown */}
            {showSalarySection && (
              <SalarySection form={form} />
            )}

            {/* Justification Section */}
            <JustificationSection form={form} />

            {/* Signature Section */}
            <SignatureSection />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Solicitação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
