
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ReunioesHeader } from "@/components/reunioes/ReunioesHeader";
import { ReunioesTabSelect } from "@/components/reunioes/ReunioesTabSelect";
import { ReunioesTabContent } from "@/components/reunioes/ReunioesTabContent";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { DatabaseConnectionStatus } from "@/components/admin/DatabaseConnectionStatus";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Reunioes = () => {
  const [activeTab, setActiveTab] = useState("agendadas");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Detectar se a barra lateral está recolhida
  useState(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[class*="md:w-20"]');
      setSidebarCollapsed(!!sidebar);
    };
    
    checkSidebarState();
    const interval = setInterval(checkSidebarState, 500);
    
    return () => clearInterval(interval);
  });

  // Função para verificar as tabelas do sistema de reuniões
  const checkReunioesTables = async () => {
    setLoading(true);
    try {
      const tables = [
        'reunioes',
        'reunioes_participantes',
        'reunioes_registros',
        'reunioes_acoes'
      ];
      
      const results: Record<string, any> = {};
      
      for (const table of tables) {
        try {
          // Tentar selecionar uma linha da tabela para verificar se existe
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (error) {
            results[table] = {
              exists: false,
              error: error.message
            };
          } else {
            results[table] = {
              exists: true,
              sample: data
            };
          }
        } catch (err: any) {
          results[table] = {
            exists: false,
            error: err.message
          };
        }
      }
      
      setDiagnosticResults(results);
      
      // Verificar se todas as tabelas existem
      const allTablesExist = Object.values(results).every(r => r.exists);
      
      if (allTablesExist) {
        toast.success("Todas as tabelas do sistema de reuniões estão implementadas corretamente");
      } else {
        toast.error("Algumas tabelas do sistema de reuniões não foram encontradas");
      }
    } catch (error) {
      console.error("Erro ao verificar tabelas:", error);
      toast.error("Erro ao verificar a estrutura do banco de dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className={`transition-all duration-300 pt-16 p-6 flex-1 ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <PermissionGuard modulo="reunioes">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <ReunioesHeader />
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowDiagnostics(!showDiagnostics);
                  if (!showDiagnostics && !diagnosticResults) {
                    checkReunioesTables();
                  }
                }}
              >
                {showDiagnostics ? "Ocultar Diagnóstico" : "Verificar Conexão"}
              </Button>
            </div>
            
            {showDiagnostics && (
              <div className="mb-6">
                <DatabaseConnectionStatus />
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Diagnóstico das Tabelas de Reuniões</h3>
                  
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span>Verificando tabelas...</span>
                    </div>
                  ) : diagnosticResults ? (
                    <div className="space-y-2">
                      {Object.entries(diagnosticResults).map(([table, result]: [string, any]) => (
                        <Alert 
                          key={table} 
                          variant={result.exists ? "default" : "destructive"}
                          className={result.exists ? "bg-green-50 border-green-200" : ""}
                        >
                          {result.exists ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          <AlertTitle>Tabela: {table}</AlertTitle>
                          <AlertDescription>
                            {result.exists 
                              ? `A tabela está implementada corretamente.`
                              : `Erro: ${result.error}`
                            }
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : null}
                  
                  <Button 
                    className="mt-2" 
                    onClick={checkReunioesTables} 
                    disabled={loading}
                  >
                    {loading ? "Verificando..." : "Verificar Tabelas Novamente"}
                  </Button>
                </div>
              </div>
            )}
            
            <ReunioesTabSelect activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <ReunioesTabContent activeTab={activeTab} />
          </div>
        </PermissionGuard>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reunioes;
