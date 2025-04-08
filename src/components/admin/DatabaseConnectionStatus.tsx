
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, CheckCircle, XCircle, Database, AlertTriangle } from "lucide-react";
import { initializeSupabaseConnection, testSupabaseConnection } from "@/utils/supabaseConnectionTest";

export function DatabaseConnectionStatus() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<any>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('loading');
    try {
      const result = await testSupabaseConnection();
      setResults(result);
      setStatus(result.success ? 'success' : 'error');
    } catch (error) {
      console.error("Error checking connection:", error);
      setStatus('error');
    }
  };

  const runFullDiagnostic = async () => {
    setStatus('loading');
    setExpanded(true);
    try {
      const result = await initializeSupabaseConnection();
      setResults(result);
      setStatus(result.connection.success ? 'success' : 'error');
    } catch (error) {
      console.error("Error running diagnostics:", error);
      setStatus('error');
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Database className="h-5 w-5" /> 
              Database Connection Status
            </CardTitle>
            <CardDescription>
              Verifies connection to Supabase and database table structure
            </CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="flex items-center justify-center p-6">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Testing database connection...</span>
          </div>
        ) : status === 'error' ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {results?.error || "Could not connect to the Supabase database."}
            </AlertDescription>
          </Alert>
        ) : status === 'success' && results ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Connected Successfully</AlertTitle>
              <AlertDescription className="text-green-700">
                Successfully connected to the Supabase database.
              </AlertDescription>
            </Alert>
            
            {results.tables && (
              <Accordion type="single" collapsible className="w-full" defaultValue={expanded ? "diagnostics" : undefined}>
                <AccordionItem value="diagnostics">
                  <AccordionTrigger>Table Diagnostics</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2">
                      {Object.entries(results.tables).map(([tableName, tableInfo]: [string, any]) => (
                        <div key={tableName} className="border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{tableName}</span>
                            {tableInfo.exists ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Missing
                              </Badge>
                            )}
                          </div>
                          {tableInfo.error && (
                            <p className="text-sm text-red-600 mt-1">{tableInfo.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkConnection}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Test Connection
        </Button>
        <Button onClick={runFullDiagnostic}>Run Full Diagnostics</Button>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: 'idle' | 'loading' | 'success' | 'error' }) {
  if (status === 'idle') {
    return <Badge variant="outline">Waiting</Badge>;
  }
  
  if (status === 'loading') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
        Testing
      </Badge>
    );
  }
  
  if (status === 'success') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="mr-1 h-3 w-3" />
        Connected
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
      <XCircle className="mr-1 h-3 w-3" />
      Failed
    </Badge>
  );
}
