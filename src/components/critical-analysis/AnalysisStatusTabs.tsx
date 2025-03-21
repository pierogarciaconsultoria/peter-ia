
import React from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { AnalysisTable } from "./AnalysisTable";

interface AnalysisStatusTabsProps {
  analyses: CriticalAnalysisItem[];
  expandedItems: {[key: string]: boolean};
  toggleExpand: (id: string) => void;
  handleAttachmentClick: (analysisId: string) => void;
  handleViewReport: (analysis: CriticalAnalysisItem) => void;
  handleDeleteAttachment: (analysisId: string, attachmentId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
}

export function AnalysisStatusTabs({
  analyses,
  expandedItems,
  toggleExpand,
  handleAttachmentClick,
  handleViewReport,
  handleDeleteAttachment,
  getStatusColor,
  getStatusText,
  getFileIcon,
  formatFileSize
}: AnalysisStatusTabsProps) {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="planned">Planejadas</TabsTrigger>
        <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
        <TabsTrigger value="completed">Concluídas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Todas as Análises Críticas</CardTitle>
            <CardDescription>
              Visualize todas as reuniões de análise crítica pela direção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar análises críticas..."
                  className="pl-8"
                />
              </div>
            </div>
            <AnalysisTable 
              analyses={analyses}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              handleAttachmentClick={handleAttachmentClick}
              handleViewReport={handleViewReport}
              handleDeleteAttachment={handleDeleteAttachment}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="planned">
        <Card>
          <CardHeader>
            <CardTitle>Análises Críticas Planejadas</CardTitle>
            <CardDescription>
              Visualize as reuniões de análise crítica planejadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.filter(a => a.status === "planned").map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-medium">{analysis.subject}</TableCell>
                    <TableCell>{analysis.participants.join(", ")}</TableCell>
                    <TableCell>{analysis.documents.join(", ")}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleExpand(analysis.id)}
                      >
                        {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="in-progress">
        <Card>
          <CardHeader>
            <CardTitle>Análises Críticas em Andamento</CardTitle>
            <CardDescription>
              Visualize as reuniões de análise crítica em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.filter(a => a.status === "in-progress").map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-medium">{analysis.subject}</TableCell>
                    <TableCell>{analysis.participants.join(", ")}</TableCell>
                    <TableCell>{analysis.documents.join(", ")}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleExpand(analysis.id)}
                      >
                        {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="completed">
        <Card>
          <CardHeader>
            <CardTitle>Análises Críticas Concluídas</CardTitle>
            <CardDescription>
              Visualize as reuniões de análise crítica concluídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Resultados</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.filter(a => a.status === "completed").map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell>{format(analysis.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-medium">{analysis.subject}</TableCell>
                    <TableCell>{analysis.participants.join(", ")}</TableCell>
                    <TableCell className="truncate max-w-xs">{analysis.results}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleExpand(analysis.id)}
                      >
                        {expandedItems[analysis.id] ? "Ocultar" : "Mostrar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
