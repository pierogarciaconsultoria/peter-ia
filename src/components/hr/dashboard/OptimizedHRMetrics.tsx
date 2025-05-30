
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, GraduationCap, TrendingUp } from 'lucide-react';
import { useOptimizedHRData } from '@/hooks/useOptimizedHRData';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const MetricCard = memo(({ title, value, icon: Icon, description }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
));

MetricCard.displayName = 'MetricCard';

export const OptimizedHRMetrics = memo(() => {
  const { empresaId } = useCurrentUser();
  const { stats, isLoading } = useOptimizedHRData(empresaId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Posições Preenchidas"
        value={stats.filledPositions}
        icon={Users}
        description={`${stats.fillRate}% de ocupação`}
      />
      <MetricCard
        title="Vagas Abertas"
        value={stats.vacantPositions}
        icon={UserPlus}
        description="Posições disponíveis"
      />
      <MetricCard
        title="Candidaturas Pendentes"
        value={stats.pendingApplications}
        icon={TrendingUp}
        description="Aguardando análise"
      />
      <MetricCard
        title="Treinamentos Ativos"
        value={stats.activeTrainings}
        icon={GraduationCap}
        description="Em andamento"
      />
    </div>
  );
});

OptimizedHRMetrics.displayName = 'OptimizedHRMetrics';
