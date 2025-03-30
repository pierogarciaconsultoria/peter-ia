
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function OnboardingHeader() {
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-2xl font-bold">Onboarding de Funcionários</h2>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Novo Onboarding
      </Button>
    </div>
  );
}
