
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { EmployeeDirectory } from "@/components/hr/EmployeeDirectory";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileSpreadsheet, 
  Plus, 
  Upload,
  FileCheck,
  FileSearch,
  ClipboardCheck,
  Trophy,
  BarChart4,
  MessageCircle,
  LineChart,
  Newspaper,
  AlertTriangle,
  Stethoscope,
  Users,
  UserCheck,
  GraduationCap,
  CalendarDays,
  UserMinus
} from "lucide-react";
import { HRFilters } from "@/components/hr/HRFilters";
import { RecruitmentSelection } from "@/components/hr/RecruitmentSelection";
import { ApprovedPositions } from "@/components/hr/ApprovedPositions";
import { OnlineAdmission } from "@/components/hr/OnlineAdmission";
import { EmployeeOnboarding } from "@/components/hr/EmployeeOnboarding";
import { TrialEvaluation } from "@/components/hr/TrialEvaluation";
import { PerformanceEvaluation } from "@/components/hr/PerformanceEvaluation";
import { JobSalaryPlan } from "@/components/hr/JobSalaryPlan";
import { FeedbackManagement } from "@/components/hr/FeedbackManagement";
import { ClimateResearch } from "@/components/hr/ClimateResearch";
import { EmployeeBoard } from "@/components/hr/EmployeeBoard";
import { OccurrenceManagement } from "@/components/hr/OccurrenceManagement";
import { MedicalCertificateManagement } from "@/components/hr/MedicalCertificateManagement";
import { ExitInterviews } from "@/components/hr/ExitInterviews";
import { DevelopmentPlans } from "@/components/hr/DevelopmentPlans";
import { VacationManagement } from "@/components/hr/VacationManagement";
import { PersonnelMovement } from "@/components/hr/PersonnelMovement";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Pessoas</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie sua equipe de forma eficiente
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </div>
          </div>
          
          <HRFilters />
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="personnel-movement">Movimentação de Pessoal</TabsTrigger>
              <TabsTrigger value="employees">Funcionários</TabsTrigger>
              <TabsTrigger value="recruitment">Recrutamento</TabsTrigger>
              <TabsTrigger value="positions">Quadro Aprovado</TabsTrigger>
              <TabsTrigger value="admission">Admissão Online</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="trial">Avaliação de Experiência</TabsTrigger>
              <TabsTrigger value="performance">Avaliação de Desempenho</TabsTrigger>
              <TabsTrigger value="exit-interviews">Entrevista de Desligamento</TabsTrigger>
              <TabsTrigger value="development-plans">Plano de Desenvolvimento</TabsTrigger>
              <TabsTrigger value="vacation">Gestão de Férias</TabsTrigger>
              <TabsTrigger value="job-plan">Cargos e Salários</TabsTrigger>
              <TabsTrigger value="feedback">Feedbacks</TabsTrigger>
              <TabsTrigger value="climate">Clima Organizacional</TabsTrigger>
              <TabsTrigger value="board">Mural do Colaborador</TabsTrigger>
              <TabsTrigger value="occurrence">Ocorrências</TabsTrigger>
              <TabsTrigger value="certificates">Atestados</TabsTrigger>
              <TabsTrigger value="departments">Departamentos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <HRDashboard />
            </TabsContent>
            
            <TabsContent value="personnel-movement">
              <PersonnelMovement />
            </TabsContent>
            
            <TabsContent value="employees">
              <EmployeeDirectory />
            </TabsContent>

            <TabsContent value="recruitment">
              <RecruitmentSelection />
            </TabsContent>

            <TabsContent value="positions">
              <ApprovedPositions />
            </TabsContent>

            <TabsContent value="admission">
              <OnlineAdmission />
            </TabsContent>

            <TabsContent value="onboarding">
              <EmployeeOnboarding />
            </TabsContent>

            <TabsContent value="trial">
              <TrialEvaluation />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceEvaluation />
            </TabsContent>

            <TabsContent value="exit-interviews">
              <ExitInterviews />
            </TabsContent>

            <TabsContent value="development-plans">
              <DevelopmentPlans />
            </TabsContent>

            <TabsContent value="vacation">
              <VacationManagement />
            </TabsContent>

            <TabsContent value="job-plan">
              <JobSalaryPlan />
            </TabsContent>

            <TabsContent value="feedback">
              <FeedbackManagement />
            </TabsContent>

            <TabsContent value="climate">
              <ClimateResearch />
            </TabsContent>

            <TabsContent value="board">
              <EmployeeBoard />
            </TabsContent>

            <TabsContent value="occurrence">
              <OccurrenceManagement />
            </TabsContent>

            <TabsContent value="certificates">
              <MedicalCertificateManagement />
            </TabsContent>
            
            <TabsContent value="departments">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Módulo de Departamentos será implementado em breve.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HumanResources;
