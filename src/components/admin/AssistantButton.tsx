
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useModuleAssistant } from "@/hooks/useModuleAssistant";
import { ModuleAssistant } from "@/components/admin/ModuleAssistant";

interface AssistantButtonProps {
  moduleName: string;
  className?: string;
}

export function AssistantButton({ moduleName, className }: AssistantButtonProps) {
  const { isEnabled, isVisible, toggleAssistant } = useModuleAssistant({
    moduleName,
    autoOpen: false
  });
  
  if (!isEnabled) return null;
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={className}
        onClick={toggleAssistant}
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        Assistente
      </Button>
      
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 w-80">
          <ModuleAssistant moduleName={moduleName} />
        </div>
      )}
    </>
  );
}
