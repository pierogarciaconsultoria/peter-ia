
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
  Trash
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { getOrganizationContexts, OrganizationContext as OrganizationContextType } from "@/services/organizationContextService";

const OrganizationContext = () => {
  const [contexts, setContexts] = useState<OrganizationContextType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("internal_factor");

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

  // Helper function to get icon for context card
  const getContextIcon = (type: string) => {
    switch (type) {
      case 'internal_factor':
        return <Building className="h-5 w-5 text-blue-500" />;
      case 'external_factor':
        return <Globe className="h-5 w-5 text-green-500" />;
      case 'interested_party':
        return <Users className="h-5 w-5 text-amber-500" />;
      case 'swot':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  // Helper function to get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case 'internal_factor':
        return 'Fator Interno';
      case 'external_factor':
        return 'Fator Externo';
      case 'interested_party':
        return 'Parte Interessada';
      case 'swot':
        return 'Análise SWOT';
      default:
        return type;
    }
  };

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
            <Button>
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      {swotAnalysis.map((item) => (
                        <ContextCard key={item.id} context={item} />
                      ))}
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
    </div>
  );
};

// ContextCard component to display each context item
const ContextCard = ({ context }: { context: OrganizationContextType }) => {
  // Helper function to get icon for context card
  const getContextIcon = (type: string) => {
    switch (type) {
      case 'internal_factor':
        return <Building className="h-5 w-5 text-blue-500" />;
      case 'external_factor':
        return <Globe className="h-5 w-5 text-green-500" />;
      case 'interested_party':
        return <Users className="h-5 w-5 text-amber-500" />;
      case 'swot':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getContextIcon(context.context_type)}
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
