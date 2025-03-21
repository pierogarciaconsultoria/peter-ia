
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CalendarClock, ListFilter, Clipboard, FileCheck2 } from "lucide-react";
import { getAudits, Audit } from "@/services/auditService";
import { toast } from "sonner";

const AuditSchedule = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const data = await getAudits();
      setAudits(data);
    } catch (error) {
      console.error("Error fetching audits:", error);
      toast.error("Falha ao carregar as auditorias");
    } finally {
      setLoading(false);
    }
  };
  
  // Filter audits based on status
  const upcomingAudits = audits.filter(audit => audit.status === 'planned');
  const inProgressAudits = audits.filter(audit => audit.status === 'in_progress');
  const completedAudits = audits.filter(audit => audit.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Auditoria</h1>
              <p className="text-muted-foreground mt-1">
                Planeje e acompanhe o cronograma de auditorias internas da sua organização.
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Auditoria
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <CalendarClock className="mr-2 h-4 w-4 text-blue-500" />
                    Auditorias Planejadas
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{upcomingAudits.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <Clipboard className="mr-2 h-4 w-4 text-amber-500" />
                    Auditorias em Andamento
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{inProgressAudits.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <FileCheck2 className="mr-2 h-4 w-4 text-green-500" />
                    Auditorias Concluídas
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{completedAudits.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="upcoming" className="flex items-center">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Planejadas
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="flex items-center">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Em Andamento
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center">
                  <FileCheck2 className="mr-2 h-4 w-4" />
                  Concluídas
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Todas
                </TabsTrigger>
              </TabsList>
            </div>
            
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Carregando auditorias...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <TabsContent value="upcoming">
                  {upcomingAudits.length > 0 ? (
                    <div className="grid gap-4">
                      {upcomingAudits.map(audit => (
                        <AuditCard key={audit.id} audit={audit} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma auditoria planejada.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="in_progress">
                  {inProgressAudits.length > 0 ? (
                    <div className="grid gap-4">
                      {inProgressAudits.map(audit => (
                        <AuditCard key={audit.id} audit={audit} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma auditoria em andamento.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="completed">
                  {completedAudits.length > 0 ? (
                    <div className="grid gap-4">
                      {completedAudits.map(audit => (
                        <AuditCard key={audit.id} audit={audit} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma auditoria concluída.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  {audits.length > 0 ? (
                    <div className="grid gap-4">
                      {audits.map(audit => (
                        <AuditCard key={audit.id} audit={audit} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma auditoria cadastrada.</p>
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

// AuditCard component to display each audit
const AuditCard = ({ audit }: { audit: Audit }) => {
  // Map status to badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Map status to display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planejada';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
      case 'canceled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{audit.title}</CardTitle>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(audit.status)}`}>
            {getStatusText(audit.status)}
          </span>
        </div>
        <CardDescription>
          Área: {audit.area} | Responsável: {audit.responsible}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {audit.description && <p className="text-sm text-muted-foreground">{audit.description}</p>}
          <div className="flex items-center justify-between text-sm">
            <span>Data: {format(new Date(audit.audit_date), 'PPP', { locale: ptBR })}</span>
            {audit.completion_date && (
              <span>Conclusão: {format(new Date(audit.completion_date), 'PPP', { locale: ptBR })}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditSchedule;
