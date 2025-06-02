
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, AlertCircle } from 'lucide-react';
import { useSchemaContext } from '@/hooks/useSchemaContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SchemaContextSelector = () => {
  const { 
    currentContext, 
    availableContexts, 
    switchContext, 
    isLoading, 
    error 
  } = useSchemaContext();

  const handleContextChange = async (projectId: string) => {
    if (projectId !== currentContext.id) {
      await switchContext(projectId);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Contexto de Schema
        </CardTitle>
        <CardDescription>
          Selecione o projeto/schema para determinar quais dados serão acessados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Projeto Ativo:</label>
          <div className="flex items-center gap-2">
            <Select
              value={currentContext.id}
              onValueChange={handleContextChange}
              disabled={isLoading}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableContexts.map((context) => (
                  <SelectItem key={context.id} value={context.id}>
                    <div className="flex items-center gap-2">
                      <span>{context.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {context.schema}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Schema Atual:</label>
            <div className="text-sm font-mono bg-muted p-2 rounded mt-1">
              {currentContext.schema.schema}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status:</label>
            <div className="mt-1">
              <Badge variant={currentContext.isActive ? "default" : "secondary"}>
                {currentContext.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Mapeamento de Tabelas (amostra):
          </label>
          <div className="text-xs font-mono bg-muted p-3 rounded space-y-1 max-h-32 overflow-y-auto">
            {Object.entries(currentContext.schema.tables).slice(0, 5).map(([original, mapped]) => (
              <div key={original} className="flex justify-between">
                <span className="text-blue-600">{original}</span>
                <span>→</span>
                <span className="text-green-600">{mapped}</span>
              </div>
            ))}
            {Object.keys(currentContext.schema.tables).length > 5 && (
              <div className="text-muted-foreground">
                ... e mais {Object.keys(currentContext.schema.tables).length - 5} tabelas
              </div>
            )}
          </div>
        </div>

        {currentContext.id !== 'default' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Atenção:</strong> Você está no contexto do projeto {currentContext.name}. 
              Todas as operações de banco de dados serão direcionadas para o schema <code>{currentContext.schema.schema}</code>.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
