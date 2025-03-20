
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RiskForm } from "./RiskForm";
import { RiskDetailsDialog } from "./RiskDetailsDialog";
import { Edit, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data for development
export const mockRisks = [
  {
    id: "1",
    title: "Falha em equipamento crítico",
    process: "Produção",
    probability: "Alta",
    impact: "Alto",
    level: "Crítico",
    status: "Aberto"
  },
  {
    id: "2",
    title: "Perda de fornecedor principal",
    process: "Compras",
    probability: "Média",
    impact: "Alto",
    level: "Alto",
    status: "Em tratamento"
  },
  {
    id: "3",
    title: "Não conformidade regulatória",
    process: "Qualidade",
    probability: "Baixa",
    impact: "Alto",
    level: "Médio",
    status: "Tratado"
  },
  {
    id: "4",
    title: "Falha no sistema ERP",
    process: "TI",
    probability: "Média",
    impact: "Médio",
    level: "Médio",
    status: "Monitorando"
  },
  {
    id: "5",
    title: "Queda de energia prolongada",
    process: "Infraestrutura",
    probability: "Baixa",
    impact: "Alto",
    level: "Médio",
    status: "Em tratamento"
  }
];

export function RisksList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRisk, setEditingRisk] = useState(null);
  const [viewingRisk, setViewingRisk] = useState(null);
  
  const filteredRisks = mockRisks.filter(risk => 
    risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case "crítico": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "alto": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "médio": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "baixo": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "aberto": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "em tratamento": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "monitorando": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "tratado": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar riscos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Processo</TableHead>
              <TableHead>Probabilidade</TableHead>
              <TableHead>Impacto</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.length > 0 ? (
              filteredRisks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium">{risk.title}</TableCell>
                  <TableCell>{risk.process}</TableCell>
                  <TableCell>{risk.probability}</TableCell>
                  <TableCell>{risk.impact}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getLevelColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(risk.status)}>
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setViewingRisk(risk)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingRisk(risk)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum risco encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editingRisk !== null} onOpenChange={(open) => !open && setEditingRisk(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Risco</DialogTitle>
          </DialogHeader>
          <RiskForm risk={editingRisk} onSuccess={() => setEditingRisk(null)} />
        </DialogContent>
      </Dialog>

      <RiskDetailsDialog 
        risk={viewingRisk} 
        open={viewingRisk !== null} 
        onOpenChange={(open) => !open && setViewingRisk(null)} 
      />
    </>
  );
}
