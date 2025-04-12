
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ClipboardCheck, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SupplierEvaluationForm } from "@/components/suppliers/SupplierEvaluationForm";
import { toast } from "sonner";
import { Supplier, Evaluation } from "@/types/supplierEvaluation";

const SupplierEvaluation = () => {
  const [activeTab, setActiveTab] = useState("suppliers");
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);

  // Mock data for demonstration
  const mockSuppliers: Supplier[] = [
    { 
      id: "1", 
      name: "Fornecedor A Ltda", 
      category: "Matéria Prima", 
      rating: 8.5, 
      status: "approved", 
      createdAt: "2023-01-15", 
      lastEvaluationDate: "2023-10-20" 
    },
    { 
      id: "2", 
      name: "Distribuidora B", 
      category: "Componentes", 
      rating: 6.8, 
      status: "pending", 
      createdAt: "2023-03-05"
    },
    { 
      id: "3", 
      name: "Serviços C S.A.", 
      category: "Serviços", 
      rating: 9.2, 
      status: "approved", 
      createdAt: "2022-11-30", 
      lastEvaluationDate: "2023-11-15" 
    },
  ];

  const handleNewEvaluation = (supplier?: Supplier) => {
    setSelectedSupplier(supplier);
    setShowEvaluationForm(true);
  };

  const handleEvaluationSubmit = (evaluation: Partial<Evaluation>) => {
    console.log("Submitted evaluation:", evaluation);
    toast.success("Avaliação registrada com sucesso");
    setShowEvaluationForm(false);
  };

  const getStatusBadge = (status: Supplier['status']) => {
    const statusConfig = {
      approved: { class: "bg-green-100 text-green-800", text: "Aprovado" },
      pending: { class: "bg-yellow-100 text-yellow-800", text: "Pendente" },
      rejected: { class: "bg-red-100 text-red-800", text: "Reprovado" }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Avaliação de Fornecedores</h1>
              <p className="text-muted-foreground mt-1">
                Avalie, qualifique fornecedores e controle não conformidades relacionadas a fornecedores.
              </p>
            </div>
            <Button onClick={() => handleNewEvaluation()} className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </div>

          <Card className="mb-6 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <ClipboardCheck className="mr-2 h-4 w-4 text-blue-500" />
                Relação com Requisitos ISO 9001:2015
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Este módulo atende aos seguintes requisitos:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                  <div>
                    <p className="font-medium">8.4 - Controle de Processos, Produtos e Serviços Providos Externamente</p>
                    <p className="text-xs text-muted-foreground">Avaliação e qualificação de fornecedores externos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
              <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
              <TabsTrigger value="nonconformities">Não Conformidades</TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockSuppliers.map((supplier) => (
                  <Card key={supplier.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        {getStatusBadge(supplier.status)}
                      </div>
                      <CardDescription>
                        Categoria: {supplier.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avaliação:</span>
                          <span className="font-medium">{supplier.rating.toFixed(1)}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Última avaliação:</span>
                          <span>{supplier.lastEvaluationDate || "Nenhuma"}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-4 bg-muted/30 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleNewEvaluation(supplier)}
                      >
                        Realizar Avaliação
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="evaluations">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Avaliações</CardTitle>
                  <CardDescription>
                    Visualize todas as avaliações realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Implementação pendente do histórico de avaliações
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nonconformities">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Não Conformidades de Fornecedores</CardTitle>
                      <CardDescription>
                        Registre e acompanhe não conformidades relacionadas a fornecedores
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Nova Não Conformidade
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Implementação pendente do registro de não conformidades
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSupplier 
                ? `Avaliar fornecedor: ${selectedSupplier.name}` 
                : 'Nova Avaliação de Fornecedor'}
            </DialogTitle>
          </DialogHeader>
          <SupplierEvaluationForm 
            supplier={selectedSupplier} 
            onSubmit={handleEvaluationSubmit}
            onCancel={() => setShowEvaluationForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierEvaluation;
