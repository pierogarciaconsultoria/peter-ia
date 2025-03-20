
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";

export function SurveyResults() {
  // Placeholder data for charts
  const satisfactionData = [
    { name: "5 estrelas", value: 0 },
    { name: "4 estrelas", value: 0 },
    { name: "3 estrelas", value: 0 },
    { name: "2 estrelas", value: 0 },
    { name: "1 estrela", value: 0 }
  ];

  const questionData = [
    { name: "Atendimento", rating: 0 },
    { name: "Qualidade", rating: 0 },
    { name: "Preço", rating: 0 },
    { name: "Prazo de entrega", rating: 0 }
  ];

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <div className="space-y-4">
            <div>
              <Label>Selecionar Pesquisa</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma pesquisa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as pesquisas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Período</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o período</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
                  <SelectItem value="year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Avaliações</CardTitle>
              <CardDescription>
                Distribuição das avaliações por número de estrelas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Avaliação por Pergunta</CardTitle>
          <CardDescription>
            Média de avaliação para cada pergunta
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={questionData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#8884d8">
                {questionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Comentários Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-10">
            Não há comentários para exibir
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
