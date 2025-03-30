
import { useOnboardingData } from "./hooks/useOnboardingData";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingStats } from "./OnboardingStats";
import { OnboardingTabs } from "./OnboardingTabs";

export function OnboardingContainer() {
  const { onboardingProcesses, isLoading } = useOnboardingData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Carregando processos de onboarding...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingHeader />
      <OnboardingStats onboardingProcesses={onboardingProcesses} />
      <OnboardingTabs onboardingProcesses={onboardingProcesses} />
    </div>
  );
}
