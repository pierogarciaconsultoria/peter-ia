import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Database, RefreshCw } from "lucide-react";
import { testSupabaseConnection } from "@/utils/supabaseConnectionTest";
import { toast } from "sonner";

export function DatabaseConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const checkConnection = async () => {
    setStatus('loading');
    try {
      const connectionResult = await testSupabaseConnection();
      setResult(connectionResult);
      setStatus(connectionResult.success ? 'success' : 'error');
      
      if (connectionResult.success) {
        toast.success("Conexão com o banco de dados estabelecida com sucesso!");
      } else {
        toast.error("Erro ao conectar com o banco de dados");
      }
    } catch (error) {
      console.error("Erro ao verificar conexão:", error);
      setStatus('error');
      toast.error("Falha ao testar conexão com o banco de dados");
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Database className="h-5 w-5" /> 
              Status da Conexão
            </CardTitle>
            <CardDescription>
              Verifica a conexão com o banco de dados Supabase
            </CardDescription>
          </div>
          {status !== 'idle' && (
            <Badge 
              variant="outline" 
              className={status === 'loading' 
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : status === 'success'
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {status === 'loading' ? (
                <><RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Testando</>
              ) : status === 'success' ? (
                <><CheckCircle className="mr-1 h-3 w-3" /> Conectado</>
              ) : (
                <><XCircle className="mr-1 h-3 w-3" /> Falha</>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="flex items-center justify-center p-6">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Testando conexão com o banco de dados...</span>
          </div>
        ) : status === 'error' ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
              <div>
                <h4 className="font-medium">Erro de conexão</h4>
                <p className="text-sm mt-1">{result?.error || "Não foi possível conectar ao banco de dados Supabase."}</p>
                {result?.details && (
                  <pre className="text-xs mt-2 p-2 bg-red-100 rounded overflow-auto max-h-32">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
                <div className="text-xs mt-2 bg-gray-50 p-2 rounded-md">
                  <p>Ambiente atual: {getEnvironmentInfo()}</p>
                  <p>Isto pode afetar como a conexão com o banco de dados é estabelecida.</p>
                </div>
              </div>
            </div>
          </div>
        ) : status === 'success' && result ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
              <div>
                <h4 className="font-medium">Conexão estabelecida com sucesso</h4>
                <p className="text-sm mt-1">
                  {result.readOnly 
                    ? "Conectado ao banco de dados (modo leitura apenas)"
                    : "Conectado ao banco de dados com acesso completo (leitura/escrita)"}
                </p>
                {result.lastConnection && (
                  <p className="text-xs mt-2">
                    Última conexão: {new Date(result.lastConnection.connection_time).toLocaleString()}
                  </p>
                )}
                <div className="text-xs mt-2 bg-gray-50 p-2 rounded-md">
                  <p>Ambiente atual: {getEnvironmentInfo()}</p>
                  <p>Sistema multi-empresa ativo. Filtragem por empresa aplicada conforme permissões.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            Clique no botão abaixo para verificar a conexão com o banco de dados
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkConnection} 
          disabled={status === 'loading'}
          className="w-full"
        >
          {status === 'loading' ? 'Verificando...' : 'Verificar Conexão'}
        </Button>
      </CardFooter>
    </Card>
  );
}
