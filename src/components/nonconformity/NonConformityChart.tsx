
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function NonConformityChart() {
  // Dados mockados para o gráfico
  const data = [
    { month: "Jan", abertas: 5, encerradas: 3 },
    { month: "Fev", abertas: 7, encerradas: 4 },
    { month: "Mar", abertas: 6, encerradas: 5 },
    { month: "Abr", abertas: 4, encerradas: 3 },
    { month: "Mai", abertas: 8, encerradas: 6 },
    { month: "Jun", abertas: 5, encerradas: 7 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Abertas" dataKey="abertas" fill="#ef4444" />
        <Bar name="Encerradas" dataKey="encerradas" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}
