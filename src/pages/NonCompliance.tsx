
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NonConformityForm } from "@/components/nonconformity/NonConformityForm";
import { NonConformityList } from "@/components/nonconformity/NonConformityList";
import { NonConformityStats } from "@/components/nonconformity/NonConformityStats";
import { NonConformityChart } from "@/components/nonconformity/NonConformityChart";

export default function NonCompliance() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todas");
  
  const handleNewNC = () => {
    setIsDialogOpen(true);
  };
  
  const handleView = (item) => {
    console.log("Visualizando:", item);
    // Navegação para detalhes
  };
  
  const handleEdit = (item) => {
    console.log("Editando:", item);
    // Abrir formulário de edição
  };
  
  const handleDelete = (item) => {
    console.log("Excluindo:", item);
    // Confirmar e excluir
  };
  
  const handleSubmitSuccess = () => {
    setIsDialogOpen(false);
    // Atualizar lista de não conformidades
    // toast.success("Não conformidade registrada com sucesso!");
  };
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 text-primary border-primary">
            ISO 9001:2015
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">Não Conformidades</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewNC}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Não Conformidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <NonConformityForm onSuccess={handleSubmitSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <NonConformityStats />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evolução de Não Conformidades</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <NonConformityChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Departamento</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {/* Outro gráfico pode ser adicionado aqui */}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar não conformidades..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedTab("todas")}>
                Todas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTab("em-analise")}>
                Em Análise
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTab("em-tratamento")}>
                Em Tratamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTab("concluidas")}>
                Concluídas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="em-analise">Em Análise</TabsTrigger>
          <TabsTrigger value="em-tratamento">Em Tratamento</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todas" className="pt-4">
          <NonConformityList 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="em-analise" className="pt-4">
          <NonConformityList 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="em-tratamento" className="pt-4">
          <NonConformityList 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="concluidas" className="pt-4">
          <NonConformityList 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
