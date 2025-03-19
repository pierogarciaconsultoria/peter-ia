
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  error: Error | null;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className="bg-destructive/20 p-3 rounded-md flex items-start mb-4">
      <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
      <div>
        <p className="font-medium text-destructive">Erro</p>
        <p className="text-sm text-destructive">{String(error)}</p>
      </div>
    </div>
  );
}
