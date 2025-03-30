
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Factory } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDepartments } from "@/hooks/useDepartments";

interface TraditionalDepartment {
  name: string;
  description: string;
  sector: string;
}

export function TraditionalDepartments() {
  const { toast } = useToast();
  const { refetch } = useDepartments();

  // List of traditional industry departments
  const traditionalDepartments: TraditionalDepartment[] = [
    {
      name: "Produção",
      description: "Responsável pela fabricação de produtos, controle de qualidade e gestão da linha de produção.",
      sector: "Operacional"
    },
    {
      name: "Manutenção",
      description: "Responsável pela manutenção preventiva e corretiva de máquinas e equipamentos.",
      sector: "Operacional"
    },
    {
      name: "Logística",
      description: "Responsável pelo recebimento de materiais, gestão de estoques e expedição de produtos.",
      sector: "Operacional"
    },
    {
      name: "Qualidade",
      description: "Responsável por garantir os padrões de qualidade dos produtos e processos.",
      sector: "Operacional"
    },
    {
      name: "Engenharia",
      description: "Responsável pelo desenvolvimento de produtos, processos e melhorias técnicas.",
      sector: "Técnico"
    },
    {
      name: "Recursos Humanos",
      description: "Responsável pelo recrutamento, seleção, treinamento e gestão de pessoas.",
      sector: "Administrativo"
    },
    {
      name: "Comercial",
      description: "Responsável pelas vendas, relacionamento com clientes e desenvolvimento de negócios.",
      sector: "Administrativo"
    },
    {
      name: "Financeiro",
      description: "Responsável pelo controle financeiro, orçamentos, contas a pagar e receber.",
      sector: "Administrativo"
    },
    {
      name: "Compras",
      description: "Responsável pela aquisição de matérias-primas, insumos e gestão de fornecedores.",
      sector: "Administrativo"
    },
    {
      name: "Tecnologia da Informação",
      description: "Responsável pela infraestrutura tecnológica, sistemas e suporte técnico.",
      sector: "Administrativo"
    },
    {
      name: "P&D",
      description: "Responsável pela pesquisa e desenvolvimento de novos produtos e inovações.",
      sector: "Técnico"
    },
    {
      name: "Marketing",
      description: "Responsável pela promoção da marca, produtos e comunicação com o mercado.",
      sector: "Administrativo"
    }
  ];

  const handleAddDepartment = async (department: TraditionalDepartment) => {
    try {
      const { error } = await supabase
        .from("departments")
        .insert({
          name: department.name,
          description: department.description,
          sector: department.sector,
        });

      if (error) throw error;

      toast({
        title: "Departamento adicionado",
        description: `O departamento ${department.name} foi adicionado com sucesso.`,
      });
      
      refetch();
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o departamento.",
        variant: "destructive",
      });
    }
  };

  // Group departments by sector
  const groupedDepartments = traditionalDepartments.reduce<Record<string, TraditionalDepartment[]>>(
    (acc, department) => {
      if (!acc[department.sector]) {
        acc[department.sector] = [];
      }
      acc[department.sector].push(department);
      return acc;
    },
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Factory className="mr-2 h-5 w-5" />
          Departamentos Tradicionais de Indústria
        </CardTitle>
        <CardDescription>
          Adicione rapidamente os departamentos tradicionais encontrados em indústrias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedDepartments).map(([sector, departments]) => (
            <div key={sector} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Setor {sector}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div 
                    key={dept.name}
                    className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge variant="outline" className="mt-1">{dept.sector}</Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {dept.description}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAddDepartment(dept)}
                        className="ml-2 h-8 gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
