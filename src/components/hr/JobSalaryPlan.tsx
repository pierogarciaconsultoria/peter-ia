
import { Button } from "@/components/ui/button";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Briefcase, Edit, LineChart, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function JobSalaryPlan() {
  // Mock data for job positions
  const [jobPositions] = useState([
    {
      id: "job1",
      title: "Desenvolvedor Junior",
      department: "Tecnologia",
      level: "Junior",
      minSalary: 3500,
      maxSalary: 5000,
      requirements: "Formação em TI, 1+ anos de experiência",
      responsibilities: "Desenvolvimento de aplicações web, manutenção de código"
    },
    {
      id: "job2",
      title: "Desenvolvedor Pleno",
      department: "Tecnologia",
      level: "Pleno",
      minSalary: 5000,
      maxSalary: 8000,
      requirements: "Formação em TI, 3+ anos de experiência",
      responsibilities: "Desenvolvimento de funcionalidades complexas, revisão de código"
    },
    {
      id: "job3",
      title: "Desenvolvedor Senior",
      department: "Tecnologia",
      level: "Senior",
      minSalary: 8000,
      maxSalary: 12000,
      requirements: "Formação em TI, 5+ anos de experiência",
      responsibilities: "Arquitetura de soluções, liderança técnica"
    },
    {
      id: "job4",
      title: "Analista de RH Junior",
      department: "Recursos Humanos",
      level: "Junior",
      minSalary: 3000,
      maxSalary: 4500,
      requirements: "Formação em RH ou áreas relacionadas",
      responsibilities: "Processos de admissão, folha de ponto"
    },
    {
      id: "job5",
      title: "Analista de RH Pleno",
      department: "Recursos Humanos",
      level: "Pleno",
      minSalary: 4500,
      maxSalary: 6500,
      requirements: "Formação em RH, 3+ anos de experiência",
      responsibilities: "Recrutamento e seleção, treinamentos"
    },
    {
      id: "job6",
      title: "Coordenador de RH",
      department: "Recursos Humanos",
      level: "Senior",
      minSalary: 7000,
      maxSalary: 10000,
      requirements: "Formação em RH, 5+ anos de experiência",
      responsibilities: "Gestão da equipe de RH, estratégias de pessoas"
    }
  ]);

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

  // Career paths data
  const careerPaths = [
    {
      department: "Tecnologia",
      paths: [
        { level: 1, title: "Desenvolvedor Junior", nextLevel: "Desenvolvedor Pleno" },
        { level: 2, title: "Desenvolvedor Pleno", nextLevel: "Desenvolvedor Senior" },
        { level: 3, title: "Desenvolvedor Senior", nextLevel: "Tech Lead" },
        { level: 4, title: "Tech Lead", nextLevel: "Gerente de Tecnologia" },
        { level: 5, title: "Gerente de Tecnologia", nextLevel: "CTO" }
      ]
    },
    {
      department: "Recursos Humanos",
      paths: [
        { level: 1, title: "Analista de RH Junior", nextLevel: "Analista de RH Pleno" },
        { level: 2, title: "Analista de RH Pleno", nextLevel: "Analista de RH Senior" },
        { level: 3, title: "Analista de RH Senior", nextLevel: "Coordenador de RH" },
        { level: 4, title: "Coordenador de RH", nextLevel: "Gerente de RH" },
        { level: 5, title: "Gerente de RH", nextLevel: "Diretor de RH" }
      ]
    }
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Plano de Cargos e Salários</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cargo
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Total de Cargos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobPositions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Departamentos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(jobPositions.map(job => job.department)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Média Salarial
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                jobPositions.reduce((acc, job) => acc + ((job.minSalary + job.maxSalary) / 2), 0) / jobPositions.length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions">
        <TabsList className="mb-6">
          <TabsTrigger value="positions">Cargos</TabsTrigger>
          <TabsTrigger value="market">Análise de Mercado</TabsTrigger>
          <TabsTrigger value="career">Planos de Carreira</TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Faixa Salarial</TableHead>
                  <TableHead>Requisitos</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobPositions.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.level}</TableCell>
                    <TableCell>
                      {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{job.requirements}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="market">
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
        </TabsContent>
        
        <TabsContent value="career">
          <div className="space-y-6">
            {careerPaths.map((path) => (
              <Card key={path.department}>
                <CardHeader>
                  <CardTitle>{path.department}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {path.paths.map((position) => (
                      <div key={position.level} className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {position.level}
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="h-1 bg-primary"></div>
                        </div>
                        <div className="ml-4 p-3 border rounded-md min-w-[200px]">
                          <p className="font-medium">{position.title}</p>
                          {position.nextLevel && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Próximo nível: {position.nextLevel}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
