
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Shield, 
  TrendingUp, 
  Building, 
  Settings, 
  CheckCircle,
  Loader2,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAnalysisIntegration } from '@/hooks/useAnalysisIntegration';
import { IntegrationPreview } from '@/types/analysis-integration';

interface AnalysisIntegrationPanelProps {
  aiSuggestions: any;
  companyData: any;
  onIntegrationComplete?: () => void;
}

const moduleIcons: Record<string, React.ElementType> = {
  strategic_planning: Target,
  organization_context: Building,
  risk_management: Shield,
  indicators: TrendingUp,
  processes: Settings,
  action_plan: CheckCircle
};

export function AnalysisIntegrationPanel({ aiSuggestions, companyData, onIntegrationComplete }: AnalysisIntegrationPanelProps) {
  const {
    loading,
    previews,
    integrationOptions,
    generatePreviews,
    applyIntegration,
    applyAllIntegrations,
    toggleIntegrationOption
  } = useAnalysisIntegration();

  React.useEffect(() => {
    if (aiSuggestions && companyData) {
      generatePreviews(aiSuggestions, companyData);
    }
  }, [aiSuggestions, companyData]);

  const handleApplyModule = async (moduleType: string) => {
    const success = await applyIntegration(moduleType, aiSuggestions, companyData);
    if (success && onIntegrationComplete) {
      onIntegrationComplete();
    }
  };

  const handleApplyAll = async () => {
    const success = await applyAllIntegrations(aiSuggestions, companyData);
    if (success && onIntegrationComplete) {
      onIntegrationComplete();
    }
  };

  if (previews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Integrações Automáticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma integração automática disponível com base nos resultados da análise.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Aplicar Sugestões nos Módulos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione quais módulos devem receber as sugestões da análise inteligente automaticamente.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opções de Integração */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(integrationOptions).map(([module, enabled]) => {
            const preview = previews.find(p => p.module === module);
            if (!preview) return null;

            return (
              <div key={module} className="flex items-center space-x-2">
                <Checkbox
                  id={module}
                  checked={enabled}
                  onCheckedChange={() => toggleIntegrationOption(module as any)}
                />
                <label
                  htmlFor={module}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {preview.title}
                </label>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Preview das Integrações */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {previews.map((preview) => {
              const Icon = moduleIcons[preview.module] || Settings;
              const enabled = integrationOptions[preview.module as keyof typeof integrationOptions];

              return (
                <Card key={preview.module} className={`${!enabled ? 'opacity-50' : ''}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {preview.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {preview.items.length} item{preview.items.length !== 1 ? 's' : ''}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!enabled || loading}
                          onClick={() => handleApplyModule(preview.module)}
                        >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Aplicar'
                          )}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {preview.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="text-sm">
                          <span className="font-medium">{item.title}:</span>{' '}
                          <span className="text-muted-foreground">
                            {item.description?.substring(0, 60)}
                            {item.description && item.description.length > 60 ? '...' : ''}
                          </span>
                        </div>
                      ))}
                      {preview.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{preview.items.length - 3} mais...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {/* Ações */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {Object.values(integrationOptions).filter(Boolean).length} módulo(s) selecionado(s)
          </p>
          <Button
            onClick={handleApplyAll}
            disabled={loading || Object.values(integrationOptions).every(v => !v)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aplicando...
              </>
            ) : (
              'Aplicar Todos'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
