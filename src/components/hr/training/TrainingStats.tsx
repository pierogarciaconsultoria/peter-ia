
import React from "react";
import { Training } from "@/services/trainingService";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Calendar, Users } from "lucide-react";

interface TrainingStatsProps {
  trainings: Training[];
}

export function TrainingStats({ trainings }: TrainingStatsProps) {
  // Cálculos estatísticos
  const totalTrainings = trainings.length;
  const completedTrainings = trainings.filter(t => t.status === 'completed').length;
  const inProgressTrainings = trainings.filter(t => t.status === 'in_progress').length;
  const plannedTrainings = trainings.filter(t => t.status === 'planned').length;
  
  // Calcular participantes totais (considerando que alguns treinamentos têm lista de participantes)
  const totalParticipants = trainings.reduce((sum, training) => {
    if (Array.isArray(training.participants)) {
      return sum + training.participants.length;
    }
    return sum;
  }, 0);
  
  // Calcular horas totais de treinamento
  const totalHours = trainings.reduce((sum, training) => sum + (training.duration || 0), 0);
  
  // Calcular completude média dos treinamentos
  const completionRate = totalTrainings > 0
    ? Math.round((completedTrainings / totalTrainings) * 100)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard 
        title="Total de Treinamentos" 
        value={totalTrainings.toString()}
        icon={Calendar}
        color="bg-blue-100 text-blue-700"
      />
      
      <StatCard 
        title="Treinamentos Completos" 
        value={`${completedTrainings} (${completionRate}%)`}
        icon={Check}
        color="bg-green-100 text-green-700"
      />
      
      <StatCard 
        title="Em Andamento" 
        value={inProgressTrainings.toString()}
        icon={Clock}
        color="bg-amber-100 text-amber-700"
      />
      
      <StatCard 
        title="Participantes" 
        value={totalParticipants.toString()}
        icon={Users}
        color="bg-purple-100 text-purple-700"
      />
    </div>
  );
}

// Componente de cartão de estatística reutilizável
interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center">
        <div className={`p-2 rounded-full mr-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
