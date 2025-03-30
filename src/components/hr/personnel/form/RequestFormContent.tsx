
import React from "react";
import { RequestFormValues } from "../types";
import { UseFormReturn } from "react-hook-form";
import { JobPosition } from "../../types";
import { MovementTypeSelector, movementTypes } from "./MovementTypeSelector";
import { EmployeeSection } from "./EmployeeSection";
import { PositionSection } from "./PositionSection";
import { ScheduleSection } from "./ScheduleSection";
import { AdmissionSection } from "./AdmissionSection";
import { TerminationSection } from "./TerminationSection";
import { SalarySection } from "./SalarySection";
import { JustificationSection } from "./JustificationSection";
import { SignatureSection } from "./SignatureSection";

interface RequestFormContentProps {
  form: UseFormReturn<RequestFormValues>;
  jobPositions: JobPosition[];
  onSubmit: () => void;
}

export function RequestFormContent({ form, jobPositions, onSubmit }: RequestFormContentProps) {
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
    <form onSubmit={onSubmit} className="space-y-4">
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
    </form>
  );
}
