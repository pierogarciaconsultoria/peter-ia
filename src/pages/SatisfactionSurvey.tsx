import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, BarChart3, ListFilter, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SurveyForm } from "@/components/surveys/SurveyForm";
import { SurveyList } from "@/components/surveys/SurveyList";
import { SurveyResults } from "@/components/surveys/SurveyResults";

const SatisfactionSurvey = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateSurvey = () => {
    setOpenDialog(false);
    // Normally here you would refresh surveys or add the new one to the list
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold">Pesquisa de Satisfação</h1>
            <p className="text-muted-foreground">
              Crie e acompanhe pesquisas de satisfação com seus clientes
            </p>
          </div>
          <div className="flex justify-end mb-4">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Pesquisa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Pesquisa de Satisfação</DialogTitle>
                </DialogHeader>
                <SurveyForm onSubmit={handleCreateSurvey} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Pesquisas</CardTitle>
                <CardDescription>Total de pesquisas enviadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Respostas</CardTitle>
                <CardDescription>Total de respostas recebidas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Satisfação Média</CardTitle>
                <CardDescription>Pontuação média de satisfação</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0.0</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Pesquisas
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Resultados
                </TabsTrigger>
                <TabsTrigger value="send" className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="list" className="mt-0">
              <SurveyList />
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              <SurveyResults />
            </TabsContent>
            
            <TabsContent value="send" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Pesquisa</CardTitle>
                  <CardDescription>
                    Envie pesquisas para seus clientes por e-mail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-10">
                    Selecione uma pesquisa na aba Pesquisas para enviá-la
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SatisfactionSurvey;
