
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
import { Edit, Plus } from "lucide-react";
import { useState } from "react";

export function ApprovedPositions() {
  // Mock data for approved positions by department
  const [approvedPositions] = useState([
    { department: "Tecnologia", approved: 12, filled: 10, open: 2 },
    { department: "Recursos Humanos", approved: 5, filled: 5, open: 0 },
    { department: "Financeiro", approved: 7, filled: 6, open: 1 },
    { department: "Vendas", approved: 15, filled: 13, open: 2 },
    { department: "Operações", approved: 25, filled: 22, open: 3 },
    { department: "Marketing", approved: 6, filled: 5, open: 1 }
  ]);

  // Chart data for positions status
  const positionsStatusData = [
    { name: "Preenchidas", value: approvedPositions.reduce((acc, curr) => acc + curr.filled, 0) },
    { name: "Em Aberto", value: approvedPositions.reduce((acc, curr) => acc + curr.open, 0) }
  ];

  const COLORS = ["#4ade80", "#f97316"];

  // Total statistics
  const totalApproved = approvedPositions.reduce((acc, curr) => acc + curr.approved, 0);
  const totalFilled = approvedPositions.reduce((acc, curr) => acc + curr.filled, 0);
  const totalOpen = approvedPositions.reduce((acc, curr) => acc + curr.open, 0);
  const filledPercentage = Math.round((totalFilled / totalApproved) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Quadro de Posições Aprovadas</h2>
        <Button>
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
            <div className="text-2xl font-bold">{totalApproved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posições Preenchidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFilled}</div>
            <p className="text-xs text-muted-foreground">{filledPercentage}% do quadro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posições em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpen}</div>
            <p className="text-xs text-muted-foreground">{100 - filledPercentage}% do quadro</p>
          </CardContent>
        </Card>
      </div>

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
                  {approvedPositions.map((position) => (
                    <TableRow key={position.department}>
                      <TableCell className="font-medium">{position.department}</TableCell>
                      <TableCell>{position.approved}</TableCell>
                      <TableCell>{position.filled}</TableCell>
                      <TableCell>{position.open}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Aprovadas</TableHead>
              <TableHead>Preenchidas</TableHead>
              <TableHead>Em Aberto</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Desenvolvedor</TableCell>
              <TableCell>Tecnologia</TableCell>
              <TableCell>8</TableCell>
              <TableCell>7</TableCell>
              <TableCell>1</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Analista de RH</TableCell>
              <TableCell>Recursos Humanos</TableCell>
              <TableCell>3</TableCell>
              <TableCell>3</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Gerente de Vendas</TableCell>
              <TableCell>Vendas</TableCell>
              <TableCell>2</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
