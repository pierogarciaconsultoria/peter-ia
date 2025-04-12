
import { useState } from "react";
import { GitBranch, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Importar componentes de processos
import { ProcessHeader } from "@/components/processes/ProcessHeader";
import { ProcessList } from "@/components/processes/ProcessList";
import { ProcessEmptyState } from "@/components/processes/ProcessEmptyState";
import ProcessMappingForm from "@/components/processes/ProcessMappingForm";
import { MacroProcessDiagram } from "@/components/processes/MacroProcessDiagram";
import { ProcessAnalysis } from "@/components/processes/ProcessAnalysis";
import { ProcessSearchFilter } from "@/components/processes/ProcessSearchFilter";

export default function ProcessPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [processList, setProcessList] = useState([]);
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <ProcessHeader />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar processos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <ProcessSearchFilter />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Processo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <ProcessMappingForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Lista de Processos</TabsTrigger>
          <TabsTrigger value="macro">Macroprocessos</TabsTrigger>
          <TabsTrigger value="analysis">Análise de Processos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="pt-4">
          {processList.length > 0 ? (
            <ProcessList searchTerm={searchTerm} />
          ) : (
            <ProcessEmptyState />
          )}
        </TabsContent>
        
        <TabsContent value="macro" className="pt-4">
          <MacroProcessDiagram />
        </TabsContent>
        
        <TabsContent value="analysis" className="pt-4">
          <ProcessAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
