
import { useState, useEffect } from "react";
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
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

const Reunioes = () => {
  const [activeTab, setActiveTab] = useState("agendadas");
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
            .from(table as any)
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
    <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-6 space-y-6">
          <PermissionGuard modulo="reunioes">
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
          </PermissionGuard>
        </div>
      </div>
    </AuthenticationRequired>
  );
};

export default Reunioes;
