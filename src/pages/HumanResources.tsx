
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Tab groups for better organization
  const tabGroups = [
    {
      label: "Principais",
      tabs: [
        { value: "dashboard", label: "Dashboard" },
        { value: "personnel-movement", label: "Movimentação de Pessoal" },
        { value: "employees", label: "Funcionários" },
        { value: "recruitment", label: "Recrutamento" },
        { value: "positions", label: "Quadro Aprovado" },
        { value: "admission", label: "Admissão Online" },
        { value: "onboarding", label: "Onboarding" }
      ]
    },
    {
      label: "Avaliações",
      tabs: [
        { value: "trial", label: "Avaliação de Experiência" },
        { value: "performance", label: "Avaliação de Desempenho" },
        { value: "exit-interviews", label: "Entrevista de Desligamento" }
      ]
    },
    {
      label: "Desenvolvimento",
      tabs: [
        { value: "development-plans", label: "Plano de Desenvolvimento" },
        { value: "vacation", label: "Gestão de Férias" },
        { value: "job-plan", label: "Cargos e Salários" }
      ]
    },
    {
      label: "Comunicação",
      tabs: [
        { value: "feedback", label: "Feedbacks" },
        { value: "climate", label: "Clima Organizacional" },
        { value: "board", label: "Mural do Colaborador" }
      ]
    },
    {
      label: "Outros",
      tabs: [
        { value: "occurrence", label: "Ocorrências" },
        { value: "certificates", label: "Atestados" },
        { value: "departments", label: "Departamentos" }
      ]
    }
  ];

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

          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Selecione uma seção" />
              </SelectTrigger>
              <SelectContent>
                {tabGroups.map((group) => (
                  <div key={group.label}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {group.label}
                    </div>
                    {group.tabs.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value}>
                        {tab.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md">
            <ScrollArea className="w-full" orientation="horizontal">
              <div className="flex p-1 min-w-max">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="flex w-full h-auto flex-wrap bg-transparent p-0 gap-1">
                    {tabGroups.flatMap(group => group.tabs).map(tab => (
                      <TabsTrigger 
                        key={tab.value} 
                        value={tab.value}
                        className="h-9 rounded-md px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
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
