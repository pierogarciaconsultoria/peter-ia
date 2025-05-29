
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, User, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMedicalCertificates } from "@/hooks/useMedicalCertificates";
import { MedicalCertificateForm } from "./medical/MedicalCertificateForm";

export function MedicalCertificateManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    certificates,
    loading,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    formatDate
  } = useMedicalCertificates();

  const handleAddCertificate = async (data: any) => {
    try {
      await addCertificate(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding medical certificate:", error);
    }
  };

  const handleApprove = async (certificateId: string) => {
    try {
      await updateCertificate(certificateId, { status: 'approved' });
    } catch (error) {
      console.error("Error approving certificate:", error);
    }
  };

  const handleReject = async (certificateId: string) => {
    try {
      await updateCertificate(certificateId, { status: 'rejected' });
    } catch (error) {
      console.error("Error rejecting certificate:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const types = {
      sickness: { label: "Doença", color: "bg-red-50 text-red-700 border-red-200" },
      appointment: { label: "Consulta", color: "bg-blue-50 text-blue-700 border-blue-200" },
      surgery: { label: "Cirurgia", color: "bg-purple-50 text-purple-700 border-purple-200" },
      other: { label: "Outros", color: "bg-gray-50 text-gray-700 border-gray-200" }
    };
    
    const typeInfo = types[type as keyof typeof types] || types.other;
    return <Badge variant="outline" className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  // Calcular estatísticas
  const totalCertificates = certificates.length;
  const pendingCertificates = certificates.filter(cert => cert.status === 'pending').length;
  const approvedCertificates = certificates.filter(cert => cert.status === 'approved').length;
  const totalDays = certificates
    .filter(cert => cert.status === 'approved')
    .reduce((sum, cert) => sum + cert.days, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-48">
      <p>Carregando atestados médicos...</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Atestados Médicos</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Atestado
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Total de Atestados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Pendentes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCertificates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Aprovados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCertificates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Total de Dias
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atestados Médicos</CardTitle>
          <CardDescription>
            Controle de atestados médicos dos funcionários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{certificate.employee?.name}</p>
                      <p className="text-sm text-muted-foreground">{certificate.employee?.department}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(certificate.type)}</TableCell>
                  <TableCell>
                    {formatDate(certificate.start_date)} - {formatDate(certificate.end_date)}
                  </TableCell>
                  <TableCell>{certificate.days} dias</TableCell>
                  <TableCell>{certificate.doctor}</TableCell>
                  <TableCell>{getStatusBadge(certificate.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {certificate.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            onClick={() => handleApprove(certificate.id)}
                          >
                            Aprovar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            onClick={() => handleReject(certificate.id)}
                          >
                            Rejeitar
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MedicalCertificateForm 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleAddCertificate}
      />
    </div>
  );
}
