
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquareWarning, 
  Clock, 
  CheckCircle, 
  Users,
  FileText,
  CalendarClock,
  Tag
} from "lucide-react";
import { getCustomerComplaints, CustomerComplaint } from "@/services/customerComplaintService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { CustomerComplaintFormDialog } from "@/components/customer-complaints/CustomerComplaintFormDialog";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const CustomerComplaints = () => {
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("open");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getCustomerComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Falha ao carregar as reclamações de clientes");
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints by status
  const openComplaints = complaints.filter(c => c.status === 'open');
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved' || c.status === 'closed');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reclamação de Cliente</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie as reclamações de clientes e acompanhe o processo de resolução.
              </p>
            </div>
            <CustomerComplaintFormDialog onSuccess={fetchComplaints} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <MessageSquareWarning className="mr-2 h-4 w-4 text-red-500" />
                    Reclamações Abertas
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{openComplaints.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    Em Tratamento
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{inProgressComplaints.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Resolvidas
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{resolvedComplaints.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="open" className="flex items-center">
                  <MessageSquareWarning className="mr-2 h-4 w-4" />
                  Abertas
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Em Tratamento
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolvidas
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Todas
                </TabsTrigger>
              </TabsList>
            </div>
            
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Carregando reclamações...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <TabsContent value="open">
                  {openComplaints.length > 0 ? (
                    <div className="grid gap-4">
                      {openComplaints.map(complaint => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma reclamação aberta.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="in_progress">
                  {inProgressComplaints.length > 0 ? (
                    <div className="grid gap-4">
                      {inProgressComplaints.map(complaint => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma reclamação em tratamento.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="resolved">
                  {resolvedComplaints.length > 0 ? (
                    <div className="grid gap-4">
                      {resolvedComplaints.map(complaint => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma reclamação resolvida.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  {complaints.length > 0 ? (
                    <div className="grid gap-4">
                      {complaints.map(complaint => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Nenhuma reclamação cadastrada.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ComplaintCard = ({ complaint }: { complaint: CustomerComplaint }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberta';
      case 'in_progress':
        return 'Em Tratamento';
      case 'resolved':
        return 'Resolvida';
      case 'closed':
        return 'Fechada';
      default:
        return status;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Baixa';
      case 'medium':
        return 'Média';
      case 'high':
        return 'Alta';
      case 'critical':
        return 'Crítica';
      default:
        return priority;
    }
  };
  
  const getTreatmentOptionText = (option?: string) => {
    if (!option) return null;
    
    switch (option) {
      case 'return':
        return 'Devolução';
      case 'credit':
        return 'Crédito';
      case 'warranty':
        return 'Garantia';
      case 'other':
        return 'Outro';
      default:
        return option;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {complaint.identification_code && (
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                  {complaint.identification_code}
                </span>
              )}
              <CardTitle className="text-lg">{complaint.customer_name}</CardTitle>
            </div>
            <CardDescription className="text-sm mt-1">
              Data: {format(new Date(complaint.complaint_date), 'PPP', { locale: ptBR })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {getStatusText(complaint.status)}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
              {getPriorityText(complaint.priority)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            {complaint.invoice_number && (
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">NF:</span>
                <span className="font-medium">{complaint.invoice_number}</span>
              </div>
            )}
            {complaint.product && (
              <div className="text-sm">
                <span className="text-muted-foreground mr-1">Produto:</span>
                <span className="font-medium">{complaint.product}</span>
              </div>
            )}
            {complaint.return_deadline && (
              <div className="text-sm">
                <span className="text-muted-foreground mr-1">Prazo de Retorno:</span>
                <span className="font-medium">
                  {format(new Date(complaint.return_deadline), 'PPP', { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
          
          {/* New treatment option display */}
          {complaint.treatment_option && (
            <div className="flex items-center text-sm mb-2">
              <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Tratativa:</span>
              <span className="font-medium">{getTreatmentOptionText(complaint.treatment_option)}</span>
            </div>
          )}
          
          {/* Action schedule link */}
          {complaint.action_schedule_id && (
            <div className="flex items-center text-sm mb-2">
              <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Ação Vinculada:</span>
              <Link to={`/action-schedule?id=${complaint.action_schedule_id}`} className="text-primary hover:underline">
                {complaint.action_schedule_id}
              </Link>
            </div>
          )}
          
          <p className="text-sm">{complaint.description}</p>
          {complaint.assigned_to && (
            <div className="mt-4 text-sm text-muted-foreground">
              Responsável: {complaint.assigned_to}
            </div>
          )}
          {complaint.resolution && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
              <strong>Resolução:</strong> {complaint.resolution}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerComplaints;
