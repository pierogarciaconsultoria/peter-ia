import { useState, useEffect, useCallback } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentForm } from "@/components/DocumentForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, AlertCircle, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAudits } from "@/services/auditService";
import { getExternalAudits } from "@/services/externalAuditService";
import { formatDistanceToNow, format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMockDashboardData } from "@/services/dashboardService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  requirements: ISORequirement[];
}

export function Dashboard({ requirements }: DashboardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoadingTimeout, setIsLoadingTimeout] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const { connectionStatus } = useAuth();

  const handleNewDocument = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // More aggressive timeout for better UX
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoadingTimeout(true);
    }, 3000); // After 3 seconds, show alternative UI
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Function to retry queries when they fail
  const handleRetryQueries = useCallback(() => {
    // Reset error state
    setErrorOccurred(false);
    // Refetch both queries
    refetchInternalAudits();
    refetchExternalAudits();
    // Show toast to indicate retrying
    toast.info("Tentando carregar dados novamente...");
  }, []);

  // Fetch internal and external audits with better error handling
  const { 
    data: internalAudits = [], 
    isLoading: isInternalAuditsLoading,
    error: internalAuditsError,
    refetch: refetchInternalAudits
  } = useQuery({
    queryKey: ['audits-dashboard'],
    queryFn: getAudits,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    meta: {
      errorHandler: (error: Error) => {
        console.error("Failed to load internal audits:", error);
        setErrorOccurred(true);
        
        if (connectionStatus === 'connected') {
          toast.error(`Erro ao carregar auditorias internas`, {
            description: "Tente novamente em alguns momentos."
          });
        }
      }
    }
  });

  const { 
    data: externalAudits = [], 
    isLoading: isExternalAuditsLoading,
    error: externalAuditsError,
    refetch: refetchExternalAudits
  } = useQuery({
    queryKey: ['external-audits-dashboard'],
    queryFn: getExternalAudits,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    meta: {
      errorHandler: (error: Error) => {
        console.error("Failed to load external audits:", error);
        setErrorOccurred(true);
        
        if (connectionStatus === 'connected') {
          toast.error(`Erro ao carregar auditorias externas`, {
            description: "Tente novamente em alguns momentos."
          });
        }
      }
    }
  });

  // Update error state if queries fail
  useEffect(() => {
    if (internalAuditsError || externalAuditsError) {
      setErrorOccurred(true);
    } else {
      setErrorOccurred(false);
    }
  }, [internalAuditsError, externalAuditsError]);

  // Filter upcoming audits (those with a future date)
  const today = new Date();
  
  const upcomingInternalAudits = internalAudits
    .filter(audit => {
      const auditDate = new Date(audit.audit_date);
      return isAfter(auditDate, today) && audit.status === 'planned';
    })
    .sort((a, b) => new Date(a.audit_date).getTime() - new Date(b.audit_date).getTime());

  const upcomingExternalAudits = externalAudits
    .filter(audit => {
      const auditDate = new Date(audit.audit_date);
      return isAfter(auditDate, today) && audit.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.audit_date).getTime() - new Date(b.audit_date).getTime());

  const nextInternalAudit = upcomingInternalAudits.length > 0 ? upcomingInternalAudits[0] : null;
  const nextExternalAudit = upcomingExternalAudits.length > 0 ? upcomingExternalAudits[0] : null;

  // Connection lost or failed to load
  const hasConnectionIssue = connectionStatus === 'disconnected';
  
  // Show fallback UI if all services failed and loading timed out
  const shouldShowFallback = 
    (isLoadingTimeout || errorOccurred || hasConnectionIssue) && 
    (internalAuditsError || isInternalAuditsLoading) && 
    (externalAuditsError || isExternalAuditsLoading);

  if (shouldShowFallback) {
    console.log("Showing fallback UI for dashboard with mock data");
    // If data loading timed out, show fallback UI with mock data
    const mockData = getMockDashboardData();
    
    return (
      <div className="appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
        <DashboardHeader onNewDocument={handleNewDocument} />
        
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problema ao carregar dados</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Não foi possível carregar todos os dados do dashboard. Exibindo dados de demonstração.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="self-start flex items-center gap-2"
              onClick={handleRetryQueries}
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
        
        {/* Upcoming Audits Section with mock data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                Próxima Auditoria Interna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{mockData.upcomingAudits[0]?.title || "Nenhuma auditoria interna agendada"}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {mockData.upcomingAudits[0] ? format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Calendar className="mr-2 h-4 w-4 text-green-500" />
                Próxima Auditoria Externa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{mockData.upcomingAudits[1]?.title || "Nenhuma auditoria externa agendada"}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {mockData.upcomingAudits[1] ? format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DocumentForm document={null} onClose={handleCloseDialog} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Normal render with real data if available
  return (
    <div className="appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
      <DashboardHeader onNewDocument={handleNewDocument} />
      
      {/* Upcoming Audits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className={nextInternalAudit ? "border-blue-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              Próxima Auditoria Interna
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isInternalAuditsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : nextInternalAudit ? (
              <div className="space-y-2">
                <p className="font-medium">{nextInternalAudit.title}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {format(new Date(nextInternalAudit.audit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <p className="text-sm font-medium text-blue-600">
                  {formatDistanceToNow(new Date(nextInternalAudit.audit_date), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma auditoria interna agendada</p>
            )}
          </CardContent>
        </Card>

        <Card className={nextExternalAudit ? "border-green-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Calendar className="mr-2 h-4 w-4 text-green-500" />
              Próxima Auditoria Externa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isExternalAuditsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : nextExternalAudit ? (
              <div className="space-y-2">
                <p className="font-medium">{nextExternalAudit.title}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {format(new Date(nextExternalAudit.audit_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <p className="text-sm font-medium text-green-600">
                  {formatDistanceToNow(new Date(nextExternalAudit.audit_date), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma auditoria externa agendada</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentForm document={null} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
