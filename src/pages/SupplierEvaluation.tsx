
import { useState } from "react";
import { Network, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SupplierEvaluation() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Network className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Avaliação de Fornecedores</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Fornecedor</h2>
            {/* Formulário de cadastro seria implementado aqui */}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fornecedores Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">152</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avaliações Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Índice de Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar fornecedores..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="pending">Pendentes de Avaliação</TabsTrigger>
          <TabsTrigger value="critical">Críticos</TabsTrigger>
          <TabsTrigger value="blocked">Bloqueados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Lista de Fornecedores</h3>
              <p className="text-sm text-muted-foreground">
                Todos os fornecedores cadastrados no sistema.
              </p>
            </div>
            <div className="border-t">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Fornecedor</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Pontuação</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Última Avaliação</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Fornecedor A Ltda</td>
                    <td className="p-4">Matéria-prima</td>
                    <td className="p-4">Aprovado</td>
                    <td className="p-4">95%</td>
                    <td className="p-4">15/03/2025</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Fornecedor B Ltda</td>
                    <td className="p-4">Serviços</td>
                    <td className="p-4">Aprovado</td>
                    <td className="p-4">87%</td>
                    <td className="p-4">22/02/2025</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Fornecedor C Ltda</td>
                    <td className="p-4">Equipamentos</td>
                    <td className="p-4">Pendente</td>
                    <td className="p-4">--</td>
                    <td className="p-4">--</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="pt-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Fornecedores Aprovados</h3>
              <p className="text-sm text-muted-foreground">
                Fornecedores que atendem aos requisitos de qualidade.
              </p>
            </div>
            {/* Similar table structure as above, but only for approved suppliers */}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="pt-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Pendentes de Avaliação</h3>
              <p className="text-sm text-muted-foreground">
                Fornecedores que precisam ser avaliados.
              </p>
            </div>
            {/* Similar table structure as above, but only for pending suppliers */}
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="pt-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Fornecedores Críticos</h3>
              <p className="text-sm text-muted-foreground">
                Fornecedores de itens críticos para o processo.
              </p>
            </div>
            {/* Similar table structure as above, but only for critical suppliers */}
          </div>
        </TabsContent>
        
        <TabsContent value="blocked" className="pt-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Fornecedores Bloqueados</h3>
              <p className="text-sm text-muted-foreground">
                Fornecedores que não atendem aos requisitos mínimos.
              </p>
            </div>
            {/* Similar table structure as above, but only for blocked suppliers */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
