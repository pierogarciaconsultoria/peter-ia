
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QualityInspection, getQualityInspections } from "@/services/qualityControlService";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart } from "@/components/quality-control/QualityChart";
import { BarChart4, Download, Filter, PieChart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, isAfter, isBefore, parseISO, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export function QualityReports() {
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last30days");
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [inspectionType, setInspectionType] = useState<string>("all");
  const [reportType, setReportType] = useState("summary");
  const { toast } = useToast();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true);
        const data = await getQualityInspections();
        setInspections(data);
      } catch (error) {
        console.error("Failed to fetch inspections:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar inspeções",
          description: "Não foi possível carregar as inspeções de qualidade."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [toast]);

  useEffect(() => {
    // Update date range based on selection
    const now = new Date();
    switch (dateRange) {
      case "last7days":
        setStartDate(format(subDays(now, 7), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case "last30days":
        setStartDate(format(subDays(now, 30), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case "last90days":
        setStartDate(format(subDays(now, 90), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case "lastYear":
        setStartDate(format(subMonths(now, 12), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case "custom":
        // Don't update dates for custom range
        break;
    }
  }, [dateRange]);

  const filteredInspections = inspections.filter(inspection => {
    const inspectionDate = parseISO(inspection.inspection_date);
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    const dateInRange = 
      (isAfter(inspectionDate, start) || inspection.inspection_date === startDate) && 
      (isBefore(inspectionDate, end) || inspection.inspection_date === endDate);
    
    const typeMatches = inspectionType === "all" || inspection.inspection_type === inspectionType;
    
    return dateInRange && typeMatches;
  });

  // Prepare chart data
  const statusData = {
    labels: ['Aprovados', 'Rejeitados', 'Com Observações'],
    datasets: [
      {
        label: 'Inspeções por Status',
        data: [
          filteredInspections.filter(i => i.status === 'approved').length,
          filteredInspections.filter(i => i.status === 'rejected').length,
          filteredInspections.filter(i => i.status === 'with_observations').length,
        ],
        backgroundColor: ['#22c55e', '#ef4444', '#eab308'],
      },
    ],
  };

  const typeData = {
    labels: ['Inspeção de Processo', 'Inspeção Final'],
    datasets: [
      {
        label: 'Inspeções por Tipo',
        data: [
          filteredInspections.filter(i => i.inspection_type === 'process').length,
          filteredInspections.filter(i => i.inspection_type === 'final').length,
        ],
        backgroundColor: ['#3b82f6', '#8b5cf6'],
      },
    ],
  };

  // Group by month for trend analysis
  const monthlyData: Record<string, { approved: number, rejected: number, withObservations: number }> = {};
  
  filteredInspections.forEach(inspection => {
    const month = format(parseISO(inspection.inspection_date), 'MMM/yyyy', { locale: ptBR });
    
    if (!monthlyData[month]) {
      monthlyData[month] = { approved: 0, rejected: 0, withObservations: 0 };
    }
    
    if (inspection.status === 'approved') {
      monthlyData[month].approved += 1;
    } else if (inspection.status === 'rejected') {
      monthlyData[month].rejected += 1;
    } else if (inspection.status === 'with_observations') {
      monthlyData[month].withObservations += 1;
    }
  });

  const trendData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Aprovados',
        data: Object.values(monthlyData).map(data => data.approved),
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Rejeitados',
        data: Object.values(monthlyData).map(data => data.rejected),
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Com Observações',
        data: Object.values(monthlyData).map(data => data.withObservations),
        backgroundColor: '#eab308',
        borderColor: '#eab308',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Relatório de Inspeções de Qualidade', 14, 22);
    
    // Add date range
    doc.setFontSize(11);
    doc.text(`Período: ${format(parseISO(startDate), 'dd/MM/yyyy')} a ${format(parseISO(endDate), 'dd/MM/yyyy')}`, 14, 30);
    
    // Add filters used
    doc.text(`Tipo de Inspeção: ${inspectionType === 'all' ? 'Todos' : inspectionType === 'process' ? 'Processo' : 'Final'}`, 14, 36);
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.text('Resumo', 14, 46);
    
    doc.setFontSize(11);
    doc.text(`Total de Inspeções: ${filteredInspections.length}`, 14, 54);
    doc.text(`Aprovadas: ${filteredInspections.filter(i => i.status === 'approved').length}`, 14, 60);
    doc.text(`Rejeitadas: ${filteredInspections.filter(i => i.status === 'rejected').length}`, 14, 66);
    doc.text(`Com Observações: ${filteredInspections.filter(i => i.status === 'with_observations').length}`, 14, 72);
    
    // Add table of inspections
    doc.setFontSize(14);
    doc.text('Lista de Inspeções', 14, 86);
    
    const tableData = filteredInspections.map(inspection => [
      format(parseISO(inspection.inspection_date), 'dd/MM/yyyy'),
      inspection.product_name,
      inspection.batch_number,
      inspection.inspection_type === 'process' ? 'Processo' : 'Final',
      inspection.status === 'approved' 
        ? 'Aprovado' 
        : inspection.status === 'rejected' 
          ? 'Rejeitado' 
          : 'Com Observações',
      inspection.inspector
    ]);
    
    autoTable(doc, {
      startY: 90,
      head: [['Data', 'Produto', 'Lote', 'Tipo', 'Status', 'Inspetor']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] },
    });
    
    // Add date of report generation
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')} - Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    doc.save(`relatorio_qualidade_${format(new Date(), 'yyyyMMdd')}.pdf`);
    
    toast({
      title: "Relatório exportado",
      description: "O relatório foi exportado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Relatórios de Qualidade</h2>
          <p className="text-muted-foreground">
            Visualize e exporte relatórios de qualidade
          </p>
        </div>
        
        <Button onClick={exportToPDF}>
          <Download className="h-4 w-4 mr-2" /> Exportar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>
            Defina os filtros para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="lastYear">Último ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Data Inicial</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data Final</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Inspeção</label>
              <Select value={inspectionType} onValueChange={setInspectionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="process">Processo</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">{filteredInspections.length}</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">{filteredInspections.filter(i => i.status === 'approved').length}</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
                <div className="h-4 w-4 rounded-full bg-red-500" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">{filteredInspections.filter(i => i.status === 'rejected').length}</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Observações</CardTitle>
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">{filteredInspections.filter(i => i.status === 'with_observations').length}</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Aprovação</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <Chart
                      type="pie"
                      data={statusData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Inspeção</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <Chart
                      type="doughnut"
                      data={typeData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Resultados</CardTitle>
                <CardDescription>
                  Evolução dos resultados de inspeções ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <Chart
                      type="line"
                      data={trendData}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0,
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>
                  Visão comparativa dos resultados das inspeções
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <Chart
                      type="bar"
                      data={statusData}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0,
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Inspeções</CardTitle>
              <CardDescription>
                Detalhes das inspeções no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredInspections.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhuma inspeção encontrada para os filtros selecionados
                </p>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lote</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inspetor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {filteredInspections.map((inspection) => (
                        <tr key={inspection.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {format(parseISO(inspection.inspection_date), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-4 py-3 text-sm">{inspection.product_name}</td>
                          <td className="px-4 py-3 text-sm">{inspection.batch_number}</td>
                          <td className="px-4 py-3 text-sm">
                            {inspection.inspection_type === 'process' ? (
                              <Badge variant="outline" className="border-blue-500 text-blue-500">Processo</Badge>
                            ) : (
                              <Badge variant="outline" className="border-purple-500 text-purple-500">Final</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {inspection.status === 'approved' ? (
                              <Badge className="bg-green-500">Aprovado</Badge>
                            ) : inspection.status === 'rejected' ? (
                              <Badge variant="destructive">Rejeitado</Badge>
                            ) : (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-500">Com Observações</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{inspection.inspector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
