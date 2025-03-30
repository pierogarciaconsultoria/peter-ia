
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface IdentityValueBadgeProps {
  value: string;
  onRemove?: () => void;
  disabled?: boolean;
}

export function IdentityValueBadge({ value, onRemove, disabled }: IdentityValueBadgeProps) {
  return (
    <Badge variant="outline" className="px-3 py-1 bg-background">
      {value}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 hover:text-destructive transition-colors focus:outline-none"
          disabled={disabled}
        >
          <X size={14} />
        </button>
      )}
    </Badge>
  );
}
