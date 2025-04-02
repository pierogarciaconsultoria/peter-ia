
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportLoadingStateProps {
  type: "bpmn" | "analysis" | "vsm" | "action";
}

export function ReportLoadingState({ type }: ReportLoadingStateProps) {
  switch (type) {
    case "bpmn":
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      );
    case "analysis":
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    case "vsm":
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      );
    case "action":
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    default:
      return null;
  }
}
