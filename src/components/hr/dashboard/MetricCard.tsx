
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface MetricStatus {
  value: number;
  status: 'success' | 'error' | 'pending';
  error?: string;
}

interface MetricCardProps {
  title: string;
  icon: any;
  metric: MetricStatus;
  description: string;
}

export function MetricCard({ title, icon: Icon, metric, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="h-4 w-4 mr-2" />
              {title}
            </div>
            {metric.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {metric.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
            {metric.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500 animate-spin" />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.status === 'pending' ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <>
              {metric.value}
              {metric.status === 'error' && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Erro
                </Badge>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {metric.status === 'error' && metric.error && (
          <p className="text-xs text-red-500 mt-1">
            {metric.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
