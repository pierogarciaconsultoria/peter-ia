
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Building, 
  Globe, 
  Users, 
  TrendingUp,
  Edit,
  Trash,
  ArrowUp,
  ArrowDown,
  Star,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { getOrganizationContexts, OrganizationContext as OrganizationContextType } from "@/services/organizationContextService";
import { ContextFormDialog } from "@/components/organization-context/ContextFormDialog";

const OrganizationContext = () => {
  const [contexts, setContexts] = useState<OrganizationContextType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("internal_factor");
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  useEffect(() => {
    fetchContexts();
  }, []);

  const fetchContexts = async () => {
    try {
      setLoading(true);
      const data = await getOrganizationContexts();
      setContexts(data);
    } catch (error) {
      console.error("Error fetching contexts:", error);
      toast.error("Falha ao carregar o contexto da organização");
    } finally {
      setLoading(false);
    }
  };

  // Filter contexts by type
  const internalFactors = contexts.filter(c => c.context_type === 'internal_factor');
  const externalFactors = contexts.filter(c => c.context_type === 'external_factor');
  const interestedParties = contexts.filter(c => c.context_type === 'interested_party');
  const swotAnalysis = contexts.filter(c => c.context_type === 'swot');

  // SWOT specific filters
  const strengths = swotAnalysis.filter(c => c.swot_category === 'strength');
  const weaknesses = swotAnalysis.filter(c => c.swot_category === 'weakness');
  const opportunities = swotAnalysis.filter(c => c.swot_category === 'opportunity');
  const threats = swotAnalysis.filter(c => c.swot_category === 'threat');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Contexto da Organização</h1>
              <p className="text-muted-foreground mt-1">
                Defina e acompanhe o contexto da sua organização, incluindo fatores internos e externos relevantes.
              </p>
            </div>
            <Button onClick={() => setFormDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="internal_factor" className="flex items-center justify-center gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Fatores Internos</span>
              </TabsTrigger>
              <TabsTrigger value="external_factor" className="flex items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Fatores Externos</span>
              </TabsTrigger>
              <TabsTrigger value="interested_party" className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Partes Interessadas</span>
              </TabsTrigger>
              <TabsTrigger value="swot" className="flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Análise SWOT</span>
              </TabsTrigger>
            </TabsList>
            
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Carregando dados do contexto...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <TabsContent value="internal_factor">
                  {internalFactors.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {internalFactors.map((item) => (
                        <ContextCard key={item.id} context={item} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhum fator interno cadastrado.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="external_factor">
                  {externalFactors.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {externalFactors.map((item) => (
                        <ContextCard key={item.id} context={item} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhum fator externo cadastrado.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="interested_party">
                  {interestedParties.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {interestedParties.map((item) => (
                        <ContextCard key={item.id} context={item} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma parte interessada cadastrada.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="swot">
                  {swotAnalysis.length > 0 ? (
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-green-200">
                          <CardHeader className="pb-2 bg-green-50/50 rounded-t-lg">
                            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                              <ArrowUp className="h-5 w-5 text-green-600" />
                              Pontos Fortes
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            {strengths.length > 0 ? (
                              <div className="grid gap-3">
                                {strengths.map((item) => (
                                  <ContextCard key={item.id} context={item} compact />
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-muted-foreground py-4">
                                Nenhum ponto forte cadastrado.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card className="border-red-200">
                          <CardHeader className="pb-2 bg-red-50/50 rounded-t-lg">
                            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                              <ArrowDown className="h-5 w-5 text-red-600" />
                              Pontos Fracos
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            {weaknesses.length > 0 ? (
                              <div className="grid gap-3">
                                {weaknesses.map((item) => (
                                  <ContextCard key={item.id} context={item} compact />
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-muted-foreground py-4">
                                Nenhum ponto fraco cadastrado.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-blue-200">
                          <CardHeader className="pb-2 bg-blue-50/50 rounded-t-lg">
                            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                              <Star className="h-5 w-5 text-blue-600" />
                              Oportunidades
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            {opportunities.length > 0 ? (
                              <div className="grid gap-3">
                                {opportunities.map((item) => (
                                  <ContextCard key={item.id} context={item} compact />
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-muted-foreground py-4">
                                Nenhuma oportunidade cadastrada.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card className="border-amber-200">
                          <CardHeader className="pb-2 bg-amber-50/50 rounded-t-lg">
                            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                              <AlertTriangle className="h-5 w-5 text-amber-600" />
                              Ameaças
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            {threats.length > 0 ? (
                              <div className="grid gap-3">
                                {threats.map((item) => (
                                  <ContextCard key={item.id} context={item} compact />
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-muted-foreground py-4">
                                Nenhuma ameaça cadastrada.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma análise SWOT cadastrada.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      
      <ContextFormDialog 
        open={formDialogOpen} 
        onOpenChange={setFormDialogOpen}
        onSuccess={fetchContexts}
      />
    </div>
  );
};

// ContextCard component to display each context item
const ContextCard = ({ context, compact = false }: { context: OrganizationContextType; compact?: boolean }) => {
  // Helper function to get icon for context card
  const getContextIcon = (type: string, category?: string) => {
    switch (type) {
      case 'internal_factor':
        return <Building className="h-5 w-5 text-blue-500" />;
      case 'external_factor':
        return <Globe className="h-5 w-5 text-green-500" />;
      case 'interested_party':
        return <Users className="h-5 w-5 text-amber-500" />;
      case 'swot':
        if (category === 'strength') return <ArrowUp className="h-5 w-5 text-green-600" />;
        if (category === 'weakness') return <ArrowDown className="h-5 w-5 text-red-600" />;
        if (category === 'opportunity') return <Star className="h-5 w-5 text-blue-600" />;
        if (category === 'threat') return <AlertTriangle className="h-5 w-5 text-amber-600" />;
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  const getSwotCategoryLabel = (category?: string) => {
    switch (category) {
      case 'strength':
        return 'Ponto Forte';
      case 'weakness':
        return 'Ponto Fraco';
      case 'opportunity':
        return 'Oportunidade';
      case 'threat':
        return 'Ameaça';
      default:
        return '';
    }
  };

  if (compact) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getContextIcon(context.context_type, context.swot_category)}
              <CardTitle className="ml-2 text-base">{context.description}</CardTitle>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Trash className="h-3.5 w-3.5 text-red-500" />
              </Button>
            </div>
          </div>
          {context.analysis && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">{context.analysis}</p>
            </div>
          )}
          <div className="mt-1 text-[10px] text-muted-foreground">
            {context.created_by} • {format(new Date(context.update_date), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getContextIcon(context.context_type, context.swot_category)}
            <CardTitle className="ml-2 text-lg">{context.description}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {context.context_type === 'swot' && context.swot_category && (
            <span className="font-medium mr-2">{getSwotCategoryLabel(context.swot_category)} • </span>
          )}
          Atualizado em: {format(new Date(context.update_date), 'dd/MM/yyyy', { locale: ptBR })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {context.analysis && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">{context.analysis}</p>
          </div>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          Criado por: {context.created_by}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationContext;
