
import React from "react";
import { FormSectionProps } from "../types";
import { PositionSection } from "../PositionSection";
import { ScheduleSection } from "../ScheduleSection";
import { AdmissionSection } from "../AdmissionSection";
import { TerminationSection } from "../TerminationSection";
import { SalarySection } from "../SalarySection";
import { JobPosition } from "../../../types";

interface ConditionalSectionsProps extends FormSectionProps {
  selectedType: string;
  jobPositions: JobPosition[];
  selectedPosition?: JobPosition | null;
}

export function ConditionalSections({ 
  form, 
  selectedType, 
  jobPositions, 
  selectedPosition 
}: ConditionalSectionsProps) {
  // Determine which sections to show based on the selected type
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
    <>
      {/* Position Section - conditionally shown */}
      {showPositionSection && (
        <PositionSection 
          form={form} 
          jobPositions={jobPositions} 
          selectedPosition={selectedPosition}
        />
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
    </>
  );
}
