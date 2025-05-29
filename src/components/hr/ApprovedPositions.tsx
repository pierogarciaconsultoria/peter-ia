
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useApprovedPositions } from "@/hooks/useApprovedPositions";
import { ApprovedPositionDialog } from "./approved-positions/ApprovedPositionDialog";

export function ApprovedPositions() {
  const { 
    positions, 
    loading, 
    error, 
    addPosition, 
    updatePosition, 
    deletePosition,
    getPositionsSummary,
    getTotals 
  } = useApprovedPositions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Chart data for positions status
  const totals = getTotals();
  const positionsStatusData = [
    { name: "Preenchidas", value: totals.totalFilled },
    { name: "Em Aberto", value: totals.totalOpen }
  ];

  const COLORS = ["#4ade80", "#f97316"];

  const handleEdit = (position: any) => {
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleSave = async (positionData: any) => {
    if (selectedPosition) {
      await updatePosition(selectedPosition.id, positionData);
    } else {
      await addPosition(positionData);
    }
    setIsDialogOpen(false);
    setSelectedPosition(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Carregando posições aprovadas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-600">Erro ao carregar posições aprovadas: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Quadro de Posições Aprovadas</h2>
        <Button onClick={() => {
          setSelectedPosition(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Posição
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posições Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalApproved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posições Preenchidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalFilled}</div>
            <p className="text-xs text-muted-foreground">{totals.filledPercentage}% do quadro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posições em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalOpen}</div>
            <p className="text-xs text-muted-foreground">{100 - totals.filledPercentage}% do quadro</p>
          </CardContent>
        </Card>
      </div>

      {totals.totalApproved > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Status das Posições</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={positionsStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {positionsStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Aprovadas</TableHead>
                      <TableHead>Preenchidas</TableHead>
                      <TableHead>Em Aberto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPositionsSummary().map((summary) => (
                      <TableRow key={summary.department}>
                        <TableCell className="font-medium">{summary.department}</TableCell>
                        <TableCell>{summary.approved}</TableCell>
                        <TableCell>{summary.filled}</TableCell>
                        <TableCell>{summary.open}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cargo</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Aprovadas</TableHead>
              <TableHead>Preenchidas</TableHead>
              <TableHead>Em Aberto</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhuma posição aprovada cadastrada
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.job_position?.title || 'N/A'}</TableCell>
                  <TableCell>{position.job_position?.code || 'N/A'}</TableCell>
                  <TableCell>{position.department?.name || 'N/A'}</TableCell>
                  <TableCell>{position.approved_count}</TableCell>
                  <TableCell>{position.filled_count}</TableCell>
                  <TableCell>{Math.max(0, position.approved_count - position.filled_count)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(position)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ApprovedPositionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedPosition(null);
        }}
        onSave={handleSave}
        position={selectedPosition}
      />
    </div>
  );
}
