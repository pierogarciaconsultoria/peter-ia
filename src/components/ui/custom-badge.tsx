
import { BadgeProps, Badge as ShadcnBadge } from "./badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps extends BadgeProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "success";
}

export function Badge({ className, variant = "default", ...props }: CustomBadgeProps) {
  // Apply custom styling for the success variant
  if (variant === "success") {
    return (
      <ShadcnBadge
        className={cn(
          "bg-green-100 text-green-800 hover:bg-green-200 border-transparent",
          className
        )}
        variant="secondary" // Fallback to secondary for the base styling
        {...props}
      />
    );
  }
  
  // Use the regular Badge for other variants
  return <ShadcnBadge className={className} variant={variant} {...props} />;
}
