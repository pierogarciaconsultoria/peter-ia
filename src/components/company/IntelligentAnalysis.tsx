import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Brain, Target, FileText, TrendingUp, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';
import { AnalysisIntegrationPanel } from './AnalysisIntegrationPanel';
import { AnalysisIntegrationService } from '@/services/analysis-integration/analysisIntegrationService';
import { useNavigate } from 'react-router-dom';

interface AnalysisResults {
  strategic_planning: any;
  iso9001_priorities: any[];
  kpis: any[];
  action_plan: any[];
  risk_analysis: any[];
  improvement_opportunities: any[];
}

export function IntelligentAnalysis() {
  const { empresaId } = useCurrentUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCompanyData, setLoadingCompanyData] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_description: '',
    operational_problems: '',
    business_objectives: '',
    company_sector: '',
    company_size: '',
    company_website: '',
    company_instagram: ''
  });

  const sectors = [
    'Tecnologia', 'Manufatura', 'Serviços', 'Comércio', 'Saúde',
    'Educação', 'Financeiro', 'Construção', 'Alimentício', 'Outro'
  ];

  const sizes = [
    'Microempresa (até 9 funcionários)',
    'Pequena (10-49 funcionários)', 
    'Média (50-249 funcionários)',
    'Grande (250+ funcionários)'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadInitialCompanyData = async () => {
      if (!empresaId) return;

      setLoadingCompanyData(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', empresaId)
          .single();

        if (error) throw error;

        const settings = (data?.settings && typeof data.settings === 'object') ? data.settings as any : {};
        const aiContext = (settings?.ai_context && typeof settings.ai_context === 'object')
          ? settings.ai_context
          : {};

        setFormData(prev => ({
          ...prev,
          company_description: data?.company_description || '',
          operational_problems: data?.operational_problems || '',
          business_objectives: data?.business_objectives || '',
          company_sector: data?.company_sector || '',
          company_size: data?.company_size || '',
          company_website: aiContext.company_website || '',
          company_instagram: aiContext.company_instagram || '',
        }));
      } catch (error) {
        console.error('Erro ao carregar dados da empresa para análise inteligente:', error);
      } finally {
        setLoadingCompanyData(false);
      }
    };

    loadInitialCompanyData();
  }, [empresaId]);

  const handleAnalyze = async () => {
    if (!formData.company_description.trim()) {
      toast.error('Por favor, descreva a operação da sua empresa');
      return;
    }

    setLoading(true);
    try {
      // Buscar dados da empresa atual
      const { data: currentCompanyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', empresaId)
        .single();

      if (companyError) throw companyError;

      // Preparar dados para análise
      const analysisData = {
        ...currentCompanyData,
        ...formData
      };

      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('company-intelligent-analysis', {
        body: { companyData: analysisData, analysisType: 'complete' }
      });

      if (error) throw error;

      if (data.success) {
        setAnalysisResults(data.analysis);
        setCompanyData(analysisData);
        
        // Aplicar automaticamente no módulo de Planejamento Estratégico
        let strategicApplied = false;
        try {
          const strategicMapping = AnalysisIntegrationService.mapStrategicPlanning(data.analysis);
          strategicApplied = await AnalysisIntegrationService.applyStrategicPlanning(strategicMapping, empresaId || '');
        } catch (integrationError) {
          console.error('Erro ao aplicar Planejamento Estratégico automaticamente:', integrationError);
        }

        if (strategicApplied) {
          toast.success('Análise gerada e Planejamento Estratégico preenchido automaticamente!');
          toast.info('Revise e edite missão, visão e valores para validação humana.');
          navigate('/strategic-planning/identity?origem=analise-inteligente');
        } else {
          toast.success('Análise gerada com sucesso!');
          toast.warning('Não foi possível preencher automaticamente o Planejamento Estratégico.');
        }
        
        // Atualizar dados da empresa com as novas informações e contexto digital para IA
        const currentSettings: any =
          currentCompanyData?.settings && typeof currentCompanyData.settings === 'object'
            ? currentCompanyData.settings
            : {};
        const currentAiContext: any =
          currentSettings?.ai_context && typeof currentSettings.ai_context === 'object'
            ? currentSettings.ai_context
            : {};

        await supabase
          .from('companies')
          .update({
            company_description: formData.company_description,
            operational_problems: formData.operational_problems,
            business_objectives: formData.business_objectives,
            company_sector: formData.company_sector,
            company_size: formData.company_size,
            settings: {
              ...currentSettings,
              ai_context: {
                ...currentAiContext,
                company_website: formData.company_website,
                company_instagram: formData.company_instagram,
              },
            },
          })
          .eq('id', empresaId);
      } else {
        throw new Error(data.error || 'Erro na análise');
      }
    } catch (error: any) {
      console.error('Erro na análise:', error);
      toast.error('Erro ao gerar análise: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationComplete = () => {
    toast.success('Integrações aplicadas! Você pode verificar os módulos atualizados.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análise Inteligente da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Setor de Atuação</Label>
              <Select value={formData.company_sector} onValueChange={(value) => handleInputChange('company_sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Porte da Empresa</Label>
              <Select value={formData.company_size} onValueChange={(value) => handleInputChange('company_size', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_website">Site da Empresa</Label>
              <Input
                id="company_website"
                type="url"
                placeholder="https://www.suaempresa.com.br"
                value={formData.company_website}
                onChange={(e) => handleInputChange('company_website', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_instagram">Instagram da Empresa</Label>
              <Input
                id="company_instagram"
                placeholder="@suaempresa ou https://instagram.com/suaempresa"
                value={formData.company_instagram}
                onChange={(e) => handleInputChange('company_instagram', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Operação *</Label>
            <Textarea
              id="description"
              placeholder="Descreva como sua empresa opera, seus principais produtos/serviços, processos principais..."
              value={formData.company_description}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problems">Principais Problemas Operacionais</Label>
            <Textarea
              id="problems"
              placeholder="Quais são os principais desafios e problemas que sua empresa enfrenta atualmente?"
              value={formData.operational_problems}
              onChange={(e) => handleInputChange('operational_problems', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Objetivos de Negócio</Label>
            <Textarea
              id="objectives"
              placeholder="Quais são os principais objetivos que sua empresa quer alcançar nos próximos 1-2 anos?"
              value={formData.business_objectives}
              onChange={(e) => handleInputChange('business_objectives', e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={loading || loadingCompanyData || !formData.company_description.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Gerar Análise Inteligente
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResults && companyData && (
        <>
          {/* Painel de Integração */}
          <AnalysisIntegrationPanel
            aiSuggestions={analysisResults}
            companyData={companyData}
            onIntegrationComplete={handleIntegrationComplete}
          />

          {/* Resultados Visuais - manter os cards existentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Planejamento Estratégico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.strategic_planning?.mission && (
                    <div>
                      <h4 className="font-semibold">Missão Sugerida:</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.strategic_planning.mission}</p>
                    </div>
                  )}
                  {analysisResults.strategic_planning?.vision && (
                    <div>
                      <h4 className="font-semibold">Visão Sugerida:</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.strategic_planning.vision}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prioridades ISO 9001
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResults.iso9001_priorities?.slice(0, 5).map((priority: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm">{priority.title || priority}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Indicadores Sugeridos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResults.kpis?.slice(0, 5).map((kpi: any, index: number) => (
                    <div key={index} className="text-sm border-l-2 border-primary pl-2">
                      <div className="font-medium">{kpi.name || kpi.title}</div>
                      <div className="text-xs text-muted-foreground">{kpi.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Oportunidades de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResults.improvement_opportunities?.slice(0, 4).map((opportunity: any, index: number) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      {opportunity.title || opportunity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
