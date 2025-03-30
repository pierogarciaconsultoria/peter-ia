
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface IdentityValueBadgeProps {
  value: string;
  onRemove: () => void;
  disabled?: boolean;
}

export function IdentityValueBadge({ value, onRemove, disabled }: IdentityValueBadgeProps) {
  return (
    <Badge variant="secondary" className="px-3 py-1">
      {value}
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 text-muted-foreground hover:text-foreground"
        disabled={disabled}
      >
        <X size={14} />
      </button>
    </Badge>
  );
}
