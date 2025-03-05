
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { RequirementCard } from "@/components/RequirementCard";
import { isoRequirements, ISORequirement } from "@/utils/isoRequirements";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, FileText, ClipboardList } from "lucide-react";
import { DocumentItem } from "@/components/DocumentItem";
import { TaskItem } from "@/components/TaskItem";
import { getDocumentsForRequirement, getTasksForRequirement } from "@/utils/isoTemplates";

const Index = () => {
  const [selectedRequirement, setSelectedRequirement] = useState<ISORequirement | null>(null);
  const [selectedChildRequirement, setSelectedChildRequirement] = useState<ISORequirement | null>(null);

  const handleCardClick = (requirement: ISORequirement) => {
    setSelectedRequirement(requirement);
  };

  const handleChildRequirementClick = (childRequirement: ISORequirement) => {
    setSelectedChildRequirement(childRequirement);
  };

  const closeRequirementDialog = () => {
    setSelectedRequirement(null);
  };

  const closeChildRequirementDialog = () => {
    setSelectedChildRequirement(null);
  };

  const calculateTotalProgress = () => {
    const totalRequirements = isoRequirements.length;
    const totalProgress = isoRequirements.reduce((sum, req) => sum + req.progress, 0);
    return Math.round(totalProgress / totalRequirements);
  };

  const countByStatus = () => {
    return {
      notStarted: isoRequirements.filter(r => r.status === 'not-started').length,
      inProgress: isoRequirements.filter(r => r.status === 'in-progress').length,
      review: isoRequirements.filter(r => r.status === 'review').length,
      completed: isoRequirements.filter(r => r.status === 'completed').length,
    };
  };

  const stats = countByStatus();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  ISO 9001:2015 Implementation
                </span>
                <h1 className="text-3xl font-bold mt-1">Quality Management System</h1>
              </div>
              <Button className="self-start">
                <Plus size={16} className="mr-2" />
                New Document
              </Button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card/80 backdrop-blur-sm border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{calculateTotalProgress()}%</CardTitle>
                  <CardDescription>Overall Progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${calculateTotalProgress()}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{stats.notStarted}</CardTitle>
                  <CardDescription>Not Started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400 rounded-full"
                      style={{ width: `${(stats.notStarted / isoRequirements.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{stats.inProgress}</CardTitle>
                  <CardDescription>In Progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(stats.inProgress / isoRequirements.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{stats.completed}</CardTitle>
                  <CardDescription>Completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(stats.completed / isoRequirements.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </header>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 appear-animate" style={{ "--delay": 1 } as React.CSSProperties}>
              ISO 9001:2015 Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isoRequirements.map((requirement, index) => (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  index={index + 2}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      {/* Main requirement dialog */}
      <Dialog open={!!selectedRequirement} onOpenChange={() => closeRequirementDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRequirement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-primary px-3 py-0.5 bg-primary/10 rounded-full">
                    {selectedRequirement.number}
                  </span>
                </div>
                <DialogTitle className="text-2xl">
                  {selectedRequirement.title}
                </DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {selectedRequirement.description}
                </DialogDescription>
              </DialogHeader>
              
              <ProgressIndicator 
                status={selectedRequirement.status} 
                progress={selectedRequirement.progress} 
                className="mt-4"
              />
              
              <Tabs defaultValue="requirements" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                  <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                </TabsList>
                <TabsContent value="requirements" className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {selectedRequirement.children?.map((child, index) => (
                      <Card 
                        key={child.id}
                        className="cursor-pointer card-hover overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm"
                        onClick={() => handleChildRequirementClick(child)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                              {child.number}
                            </span>
                          </div>
                          <CardTitle className="text-lg mt-2">{child.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ProgressIndicator 
                            status={child.status} 
                            progress={child.progress} 
                          />
                        </CardContent>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            {child.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="documents">
                  {selectedRequirement && getDocumentsForRequirement(selectedRequirement.number).length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {getDocumentsForRequirement(selectedRequirement.number).map((document) => (
                        <DocumentItem key={document.id} document={document} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                        <FileText size={28} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">Nenhum documento encontrado</h3>
                      <p className="text-muted-foreground mt-2">
                        Não há documentos associados a este requisito ainda.
                      </p>
                      <Button className="mt-4">
                        <Plus size={16} className="mr-2" />
                        Adicionar Documento
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tasks">
                  {selectedRequirement && getTasksForRequirement(selectedRequirement.number).length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {getTasksForRequirement(selectedRequirement.number).map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                        <ClipboardList size={28} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">Nenhuma tarefa encontrada</h3>
                      <p className="text-muted-foreground mt-2">
                        Não há tarefas associadas a este requisito ainda.
                      </p>
                      <Button className="mt-4">
                        <Plus size={16} className="mr-2" />
                        Adicionar Tarefa
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Child requirement dialog */}
      <Dialog open={!!selectedChildRequirement} onOpenChange={() => closeChildRequirementDialog()}>
        <DialogContent className="max-w-2xl">
          {selectedChildRequirement && (
            <>
              <DialogHeader>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 left-2 h-8 w-8 p-0 rounded-full"
                  onClick={closeChildRequirementDialog}
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="flex items-center gap-2 mb-1 mt-4">
                  <span className="text-sm font-medium text-primary px-3 py-0.5 bg-primary/10 rounded-full">
                    {selectedChildRequirement.number}
                  </span>
                </div>
                <DialogTitle className="text-2xl">
                  {selectedChildRequirement.title}
                </DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {selectedChildRequirement.description}
                </DialogDescription>
              </DialogHeader>
              
              <ProgressIndicator 
                status={selectedChildRequirement.status} 
                progress={selectedChildRequirement.progress} 
                className="mt-4"
              />
              
              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                  <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="rounded-lg border border-border/40 p-4">
                    <h4 className="text-sm font-medium mb-2">Orientação para Implementação</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedChildRequirement.recommendedActions || "Para atender a este requisito, você precisa estabelecer processos e documentação que demonstrem como sua organização aborda este aspecto específico da norma ISO 9001:2015."}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/40 p-4">
                    <h4 className="text-sm font-medium mb-2">Evidências Necessárias</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedChildRequirement.evidence || "Documente sua abordagem, crie procedimentos, mantenha registros e garanta que eles estejam acessíveis às partes interessadas relevantes."}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/40 p-4">
                    <h4 className="text-sm font-medium mb-2">Atualização de Status</h4>
                    <div className="flex space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="flex-1">Definir Em Andamento</Button>
                      <Button variant="outline" size="sm" className="flex-1">Marcar como Concluído</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="documents">
                  {selectedChildRequirement && getDocumentsForRequirement(selectedChildRequirement.number).length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {getDocumentsForRequirement(selectedChildRequirement.number).map((document) => (
                        <DocumentItem key={document.id} document={document} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                        <FileText size={28} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">Nenhum documento encontrado</h3>
                      <p className="text-muted-foreground mt-2">
                        Não há documentos associados a este requisito ainda.
                      </p>
                      <Button className="mt-4">
                        <Plus size={16} className="mr-2" />
                        Adicionar Documento
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tasks">
                  {selectedChildRequirement && getTasksForRequirement(selectedChildRequirement.number).length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {getTasksForRequirement(selectedChildRequirement.number).map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                        <ClipboardList size={28} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">Nenhuma tarefa encontrada</h3>
                      <p className="text-muted-foreground mt-2">
                        Não há tarefas associadas a este requisito ainda.
                      </p>
                      <Button className="mt-4">
                        <Plus size={16} className="mr-2" />
                        Adicionar Tarefa
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
