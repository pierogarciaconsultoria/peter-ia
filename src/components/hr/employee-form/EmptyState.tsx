
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface EmptyStateProps {
  message: string;
  buttonText: string;
  onAction: () => void;
}

export function EmptyState({ message, buttonText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <UserPlus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        Os dados do funcionário são essenciais para o gerenciamento completo de recursos humanos.
      </p>
      <Button onClick={onAction}>{buttonText}</Button>
    </div>
  );
}
