
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface SalaryComparisonChartProps {
  formatCurrency: (value: number) => string;
}

export function SalaryComparisonChart({ formatCurrency }: SalaryComparisonChartProps) {
  // Data for salary comparison chart
  const salaryComparisonData = [
    { 
      name: 'Desenvolvedor Junior', 
      'Empresa Atual': 4200, 
      'Mercado': 4500 
    },
    { 
      name: 'Desenvolvedor Pleno', 
      'Empresa Atual': 6500, 
      'Mercado': 7000 
    },
    { 
      name: 'Desenvolvedor Senior', 
      'Empresa Atual': 10000, 
      'Mercado': 11000 
    },
    { 
      name: 'Analista RH Junior', 
      'Empresa Atual': 3800, 
      'Mercado': 3500 
    },
    { 
      name: 'Analista RH Pleno', 
      'Empresa Atual': 5500, 
      'Mercado': 5800 
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo Salarial com o Mercado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salaryComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="Empresa Atual" fill="#6366f1" />
              <Bar dataKey="Mercado" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
