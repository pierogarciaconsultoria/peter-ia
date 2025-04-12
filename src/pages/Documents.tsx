
import { useState } from "react";
import { FileText, Search, Filter, Plus } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";

// Importar componentes de documentos
import { DocumentsList } from "@/components/DocumentsList";
import { DocumentForm } from "@/components/DocumentForm";
import { DocumentTemplates } from "@/components/DocumentTemplates";

export default function Documents() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("all");
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Documentos</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DocumentForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar documentos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setCurrentView("all")}>
              Todos os Documentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentView("procedures")}>
              Procedimentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentView("instructions")}>
              Instruções de Trabalho
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentView("forms")}>
              Formulários
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentView("manuals")}>
              Manuais
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="review">Em Revisão</TabsTrigger>
          <TabsTrigger value="obsolete">Obsoletos</TabsTrigger>
          <TabsTrigger value="templates">Modelos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-4">
          <DocumentsList status="active" searchTerm={searchTerm} documentType={currentView} />
        </TabsContent>
        
        <TabsContent value="draft" className="pt-4">
          <DocumentsList status="draft" searchTerm={searchTerm} documentType={currentView} />
        </TabsContent>
        
        <TabsContent value="review" className="pt-4">
          <DocumentsList status="review" searchTerm={searchTerm} documentType={currentView} />
        </TabsContent>
        
        <TabsContent value="obsolete" className="pt-4">
          <DocumentsList status="obsolete" searchTerm={searchTerm} documentType={currentView} />
        </TabsContent>
        
        <TabsContent value="templates" className="pt-4">
          <DocumentTemplates searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
