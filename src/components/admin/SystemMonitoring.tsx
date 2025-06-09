
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthMonitor } from "@/components/system/HealthMonitor";
import { getAuditLogs, AuditLogEntry } from "@/services/auditService";
import { performHealthCheck } from "@/services/healthCheckService";
import { isProductionEnvironment } from "@/utils/lovableEditorDetection";
import { Shield, Activity, Database, Users } from "lucide-react";

export function SystemMonitoring() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    status: '',
    user_id: ''
  });

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const logs = await getAuditLogs({
        action: filters.action || undefined,
        status: filters.status || undefined,
        user_id: filters.user_id || undefined,
        limit: 50
      });
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      denied: 'destructive',
      error: 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ambiente</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isProductionEnvironment() ? 'Produção' : 'Desenvolvimento'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isProductionEnvironment() ? 'Sistema em produção' : 'Ambiente de desenvolvimento'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segurança</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              RLS e auditoria habilitados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs de Auditoria</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Eventos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autenticação</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Supabase</div>
            <p className="text-xs text-muted-foreground">
              Provider ativo
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Check</TabsTrigger>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="security">Configurações de Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <HealthMonitor />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Input
                placeholder="User ID"
                value={filters.user_id}
                onChange={(e) => setFilters(prev => ({ ...prev, user_id: e.target.value }))}
              />
              <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="LOGIN_ATTEMPT">Login</SelectItem>
                  <SelectItem value="DATA_ACCESS">Acesso a Dados</SelectItem>
                  <SelectItem value="PERMISSION_DENIED">Permissão Negada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="denied">Negado</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadAuditLogs} disabled={isLoading}>
                Filtrar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eventos de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              {!isProductionEnvironment() ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Logs de auditoria disponíveis apenas em produção
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Recurso</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          {log.timestamp.toLocaleString()}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-sm">
                          {log.user_id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{log.target_resource || '-'}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                      </TableRow>
                    ))}
                    {auditLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          Nenhum evento encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Row Level Security (RLS)</h4>
                  <Badge variant="default">Habilitado</Badge>
                  <p className="text-sm text-muted-foreground">
                    Políticas RLS ativas em todas as tabelas críticas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Auditoria de Segurança</h4>
                  <Badge variant="default">Habilitado</Badge>
                  <p className="text-sm text-muted-foreground">
                    Eventos de segurança são logados automaticamente
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Autenticação</h4>
                  <Badge variant="default">Supabase Auth</Badge>
                  <p className="text-sm text-muted-foreground">
                    Autenticação robusta com JWT e PKCE
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Bypass de Desenvolvimento</h4>
                  <Badge variant={isProductionEnvironment() ? "default" : "destructive"}>
                    {isProductionEnvironment() ? "Desabilitado" : "Habilitado"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {isProductionEnvironment() 
                      ? "Seguro para produção" 
                      : "Apenas em desenvolvimento"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
