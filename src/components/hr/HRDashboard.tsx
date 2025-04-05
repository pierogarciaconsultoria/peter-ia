
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./dashboard/OverviewTab";
import { PeopleTab } from "./dashboard/PeopleTab";
import { TrainingTab } from "./dashboard/TrainingTab";
import { FinancialTab } from "./dashboard/FinancialTab";

export function HRDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const metrics = {
    totalEmployees: 42,
    newHires: 3,
    upcomingEvaluations: 5,
    pendingTrainings: 8,
    departments: 6,
    turnoverRate: 4.2, // percentage
    averageTenure: 2.7, // years
    pendingRecruitments: 3,
    vacationRequests: 2,
    approvedPositions: 48,
    filledPositions: 42,
    medicalLeaves: 1
  };

  const departmentDistribution = [
    { name: 'Administrativo', value: 10 },
    { name: 'Comercial', value: 8 },
    { name: 'Financeiro', value: 6 },
    { name: 'Produção', value: 12 },
    { name: 'TI', value: 4 },
    { name: 'RH', value: 2 }
  ];
  
  const turnoverData = [
    { month: 'Jan', value: 2.1 },
    { month: 'Fev', value: 1.8 },
    { month: 'Mar', value: 3.2 },
    { month: 'Abr', value: 2.7 },
    { month: 'Mai', value: 3.8 },
    { month: 'Jun', value: 4.2 }
  ];
  
  const recruitmentStatus = [
    { name: 'Abertas', value: 3 },
    { name: 'Em processo', value: 5 },
    { name: 'Concluídas', value: 4 }
  ];
  
  const trainingCompletionData = [
    { name: 'Completos', value: 28 },
    { name: 'Em progresso', value: 12 },
    { name: 'Não iniciados', value: 8 }
  ];

  const evaluationScores = [
    { name: 'Excelente', value: 15 },
    { name: 'Bom', value: 18 },
    { name: 'Regular', value: 7 },
    { name: 'Precisa melhorar', value: 2 }
  ];
  
  const salaryComparisonData = [
    { 
      position: 'Dev Junior', 
      'Empresa': 4200,
      'Mercado': 4500 
    },
    { 
      position: 'Dev Pleno', 
      'Empresa': 6500,
      'Mercado': 7000 
    },
    { 
      position: 'Dev Senior', 
      'Empresa': 10000,
      'Mercado': 11000 
    },
    { 
      position: 'Analista RH', 
      'Empresa': 3800,
      'Mercado': 3500 
    },
    { 
      position: 'Gerente', 
      'Empresa': 12000,
      'Mercado': 13500 
    }
  ];
  
  const employeeCostsData = [
    { month: 'Jan', salaries: 150000, benefits: 45000, taxes: 60000 },
    { month: 'Fev', salaries: 152000, benefits: 46000, taxes: 61000 },
    { month: 'Mar', salaries: 155000, benefits: 47000, taxes: 62000 },
    { month: 'Abr', salaries: 160000, benefits: 48000, taxes: 64000 },
    { month: 'Mai', salaries: 162000, benefits: 48500, taxes: 65000 },
    { month: 'Jun', salaries: 165000, benefits: 50000, taxes: 66000 }
  ];
  
  const discDistribution = [
    { name: 'D (Dominante)', value: 12, color: '#ef4444' },
    { name: 'I (Influente)', value: 15, color: '#eab308' },
    { name: 'S (Estável)', value: 10, color: '#22c55e' },
    { name: 'C (Conformista)', value: 5, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="people">Pessoas</TabsTrigger>
          <TabsTrigger value="training">Capacitação</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            metrics={metrics} 
            departmentDistribution={departmentDistribution}
            turnoverData={turnoverData}
          />
        </TabsContent>
        
        <TabsContent value="people">
          <PeopleTab 
            metrics={metrics}
            discDistribution={discDistribution}
            recruitmentStatus={recruitmentStatus}
            evaluationScores={evaluationScores}
          />
        </TabsContent>
        
        <TabsContent value="training">
          <TrainingTab 
            trainingCompletionData={trainingCompletionData}
          />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialTab 
            salaryComparisonData={salaryComparisonData}
            employeeCostsData={employeeCostsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
