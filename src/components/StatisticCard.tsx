
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticCardProps {
  title: string;
  value: number;
  description: string;
  color?: string;
  total?: number;
}

export function StatisticCard({ title, value, description, color = "bg-primary", total = 0 }: StatisticCardProps) {
  const percentage = total > 0 ? (value / total) * 100 : value;
  
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">{value}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
