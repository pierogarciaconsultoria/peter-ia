
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GlobalAssistantModal } from "./GlobalAssistantModal";

export function AssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Assistente Peter.IA"
        className="relative"
      >
        <Bot className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
      </Button>
      
      <GlobalAssistantModal 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
}
