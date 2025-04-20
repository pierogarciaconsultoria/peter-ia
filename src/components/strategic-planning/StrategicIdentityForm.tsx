
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StrategicIdentity } from "@/types/strategic-planning";
import { ManualIdentityForm } from "./ManualIdentityForm";
import { IdentityFormActions } from "./IdentityFormActions";
import { IdentitySuggestionDialog } from "./IdentitySuggestionDialog";
import { IndicatorSuggestionDialog } from "./IndicatorSuggestionDialog";
import { IdentityFormHeader } from "./components/IdentityFormHeader";
import { IdentityEditingActions } from "./components/IdentityEditingActions";
import { useStrategicIdentity } from "./hooks/useStrategicIdentity";

interface StrategicIdentityFormProps {
  identity: StrategicIdentity | null;
  onUpdate: () => void;
}

export function StrategicIdentityForm({ identity, onUpdate }: StrategicIdentityFormProps) {
  const {
    mission,
    setMission,
    vision,
    setVision,
    values,
    setValues,
    loading,
    isEditing,
    setIsEditing,
    showAiSuggestions,
    setShowAiSuggestions,
    showIndicatorSuggestions,
    setShowIndicatorSuggestions,
    handleSubmit,
    resetForm,
  } = useStrategicIdentity(identity, onUpdate);

  const hasIdentityData = mission.trim() !== "" && vision.trim() !== "" && values.length > 0;

  const handleApplySuggestions = (suggestions: Pick<StrategicIdentity, "mission" | "vision" | "values">) => {
    setMission(suggestions.mission);
    setVision(suggestions.vision);
    setValues(suggestions.values);
  };

  return (
    <Card className="mb-6">
      <IdentityFormHeader
        isEditing={isEditing}
        onShowAiSuggestions={() => setShowAiSuggestions(true)}
      />
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ManualIdentityForm
            mission={mission}
            setMission={setMission}
            vision={vision}
            setVision={setVision}
            values={values}
            setValues={setValues}
            isLoading={loading}
            isEditable={isEditing}
          />
          
          {isEditing ? (
            <IdentityFormActions 
              onReset={resetForm}
              isLoading={loading}
            />
          ) : (
            <IdentityEditingActions
              hasIdentityData={hasIdentityData}
              onShowIndicatorSuggestions={() => setShowIndicatorSuggestions(true)}
              onEnableEditing={() => setIsEditing(true)}
            />
          )}
        </form>
      </CardContent>

      <IdentitySuggestionDialog
        open={showAiSuggestions}
        onClose={() => setShowAiSuggestions(false)}
        onAccept={handleApplySuggestions}
      />

      {hasIdentityData && (
        <IndicatorSuggestionDialog
          open={showIndicatorSuggestions}
          onClose={() => setShowIndicatorSuggestions(false)}
          identity={{
            mission,
            vision,
            values
          }}
        />
      )}
    </Card>
  );
}
