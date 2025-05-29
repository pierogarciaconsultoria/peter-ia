
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarCheck, 
  CalendarDays, 
  CalendarRange, 
  Download, 
  Eye, 
  FileText, 
  Plus, 
  Search, 
  Stethoscope,
  Upload 
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useMedicalCertificates } from "@/hooks/useMedicalCertificates";
import { Loader2 } from "lucide-react";

export function MedicalCertificateManagement() {
  const { certificates, loading, error } = useMedicalCertificates();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter certificates based on search and filters
  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || certificate.type === typeFilter;
    const matchesStatus = statusFilter === "all" || certificate.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const totalDays = certificates.reduce((sum, cert) => sum + cert.days, 0);
  const pendingCount = certificates.filter(c => c.status === "pending").length;
  const approvedCount = certificates.filter(c => c.status === "approved").length;

  // Data for charts
  const typeData = [
    { name: 'Doença', value: certificates.filter(c => c.type === "sickness").length },
    { name: 'Consulta', value: certificates.filter(c => c.type === "appointment").length },
    { name: 'Cirurgia', value: certificates.filter(c => c.type === "surgery").length },
    { name: 'Outro', value: certificates.filter(c => c.type === "other").length },
  ].filter(item => item.value > 0);

  const departmentData = [
    { name: 'Tecnologia', days: certificates.filter(c => c.employee?.department === "Tecnologia").reduce((sum, cert) => sum + cert.days, 0) },
    { name: 'RH', days: certificates.filter(c => c.employee?.department === "Recursos Humanos").reduce((sum, cert) => sum + cert.days, 0) },
    { name: 'Marketing', days: certificates.filter(c => c.employee?.department === "Marketing").reduce((sum, cert) => sum + cert.days, 0) },
    { name: 'Admin', days: certificates.filter(c => c.employee?.department === "Administrativo").reduce((sum, cert) => sum + cert.days, 0) },
  ].filter(item => item.days > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "sickness":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Doença</Badge>;
      case "appointment":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Consulta</Badge>;
      case "surgery":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Cirurgia</Badge>;
      case "other":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Outro</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Carregando atestados médicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-600">Erro ao carregar atestados médicos: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Atestados</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Atestado
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Stethoscope className="h-4 w-4 mr-2" />
                Total de Atestados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CalendarRange className="h-4 w-4 mr-2" />
                Dias de Afastamento
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Aprovados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Pendentes de Aprovação
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {typeData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {departmentData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dias de Afastamento por Departamento</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="days" name="Dias de Afastamento" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar atestados..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="sickness">Doença</SelectItem>
              <SelectItem value="appointment">Consulta</SelectItem>
              <SelectItem value="surgery">Cirurgia</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>CID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                    ? "Nenhum atestado encontrado com os filtros aplicados" 
                    : "Nenhum atestado médico cadastrado"}
                </TableCell>
              </TableRow>
            ) : (
              filteredCertificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={certificate.employee?.avatar_url} />
                        <AvatarFallback>
                          {certificate.employee?.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{certificate.employee?.name}</span>
                        <span className="text-xs text-muted-foreground">{certificate.employee?.department}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(certificate.type)}</TableCell>
                  <TableCell>
                    {new Date(certificate.start_date).toLocaleDateString('pt-BR')}
                    {certificate.days > 1 && (
                      <> - {new Date(certificate.end_date).toLocaleDateString('pt-BR')}</>
                    )}
                  </TableCell>
                  <TableCell>{certificate.days}</TableCell>
                  <TableCell>{certificate.doctor}</TableCell>
                  <TableCell>{certificate.cid || "-"}</TableCell>
                  <TableCell>{getStatusBadge(certificate.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
