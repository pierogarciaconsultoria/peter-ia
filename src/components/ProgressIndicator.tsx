
import { RequirementStatus } from "@/utils/isoRequirements";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  status: RequirementStatus;
  progress: number;
  className?: string;
}

const statusColors = {
  'not-started': 'bg-gray-200 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'review': 'bg-amber-100 text-amber-700',
  'completed': 'bg-green-100 text-green-700',
};

const statusLabels = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'review': 'Under Review',
  'completed': 'Completed',
};

export function ProgressIndicator({ status, progress, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span 
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            statusColors[status]
          )}
        >
          {statusLabels[status]}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {progress}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            {
              'bg-gray-300': status === 'not-started',
              'bg-blue-500': status === 'in-progress',
              'bg-amber-500': status === 'review',
              'bg-green-500': status === 'completed',
            }
          )} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Add the new ProgressCircle component that was missing
interface ProgressCircleProps {
  progress: number;
  size: number;
  color: string;
}

export function ProgressCircle({ progress, size, color }: ProgressCircleProps) {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-xs font-medium">{progress}%</span>
    </div>
  );
}
