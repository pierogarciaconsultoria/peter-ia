
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ChevronRight, 
  Filter, 
  MessageSquare, 
  MessageSquarePlus, 
  Plus, 
  ThumbsUp, 
  ChevronDown,
  Star,
  Eye
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FeedbackManagement() {
  // Mock data for feedback
  const [feedbacks] = useState([
    {
      id: "f1",
      sender: {
        name: "Maria Santos",
        position: "Gerente de TI",
        avatar: ""
      },
      receiver: {
        name: "João Silva",
        position: "Desenvolvedor React",
        avatar: ""
      },
      type: "recognition",
      title: "Excelente trabalho no projeto X",
      content: "Parabéns pelo excelente trabalho no projeto X. Sua dedicação e qualidade técnica foram fundamentais para o sucesso da entrega.",
      visibility: "public",
      createdAt: "2023-10-15",
      status: "sent"
    },
    {
      id: "f2",
      sender: {
        name: "Carlos Mendes",
        position: "Diretor de RH",
        avatar: ""
      },
      receiver: {
        name: "Ana Oliveira",
        position: "Analista de RH",
        avatar: ""
      },
      type: "improvement",
      title: "Melhoria em processos de recrutamento",
      content: "Gostaria de sugerir algumas melhorias nos processos de recrutamento para torná-los mais eficientes...",
      visibility: "private",
      createdAt: "2023-10-10",
      status: "sent"
    },
    {
      id: "f3",
      sender: {
        name: "Roberto Alves",
        position: "Gerente de Operações",
        avatar: ""
      },
      receiver: {
        name: "Pedro Souza",
        position: "Analista de Marketing",
        avatar: ""
      },
      type: "1on1",
      title: "Acompanhamento Mensal",
      content: "No nosso acompanhamento mensal, gostaria de destacar os seguintes pontos de atenção...",
      visibility: "private",
      createdAt: "2023-10-05",
      status: "draft"
    }
  ]);

  const sentFeedbacks = feedbacks.filter(f => f.status === "sent");
  const draftFeedbacks = feedbacks.filter(f => f.status === "draft");
  const receivedFeedbacks = feedbacks.filter(f => f.receiver.name === "Maria Santos");

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "recognition":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Reconhecimento</Badge>;
      case "improvement":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Melhoria</Badge>;
      case "1on1":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">1:1</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Público</Badge>;
      case "private":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Privado</Badge>;
      default:
        return <Badge variant="outline">{visibility}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Feedbacks</h2>
        <Button>
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Novo Feedback
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedbacks Enviados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentFeedbacks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Feedbacks Recebidos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedFeedbacks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Reconhecimentos Públicos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter(f => f.type === "recognition" && f.visibility === "public").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="recognition">Reconhecimento</SelectItem>
            <SelectItem value="improvement">Melhoria</SelectItem>
            <SelectItem value="1on1">1:1</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Visibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="public">Pública</SelectItem>
            <SelectItem value="private">Privada</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
          <TabsTrigger value="received">Recebidos</TabsTrigger>
          <TabsTrigger value="drafts">Rascunhos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>De</TableHead>
                  <TableHead>Para</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={feedback.sender.avatar} />
                          <AvatarFallback>{feedback.sender.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{feedback.sender.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={feedback.receiver.avatar} />
                          <AvatarFallback>{feedback.receiver.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{feedback.receiver.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(feedback.type)}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{feedback.title}</TableCell>
                    <TableCell>{getVisibilityBadge(feedback.visibility)}</TableCell>
                    <TableCell>{new Date(feedback.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {sentFeedbacks.map(feedback => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{feedback.title}</CardTitle>
                      <CardDescription>
                        Para: {feedback.receiver.name} ({feedback.receiver.position})
                      </CardDescription>
                    </div>
                    <div>
                      {getTypeBadge(feedback.type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{feedback.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver completo <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="received" className="pt-6">
          {receivedFeedbacks.length === 0 ? (
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertTitle>Sem feedbacks recebidos</AlertTitle>
              <AlertDescription>
                Você ainda não recebeu nenhum feedback.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Map through received feedbacks here */}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drafts" className="pt-6">
          {draftFeedbacks.length === 0 ? (
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertTitle>Sem rascunhos</AlertTitle>
              <AlertDescription>
                Você não tem rascunhos de feedback salvos.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Map through draft feedbacks here */}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-4">Reconhecimentos Públicos Recentes</h3>
        <div className="space-y-4">
          {feedbacks
            .filter(f => f.type === "recognition" && f.visibility === "public")
            .map(feedback => (
              <Card key={feedback.id} className="bg-green-50/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={feedback.sender.avatar} />
                        <AvatarFallback>{feedback.sender.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{feedback.sender.name}</p>
                        <p className="text-xs text-muted-foreground">{feedback.sender.position}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={feedback.receiver.avatar} />
                        <AvatarFallback>{feedback.receiver.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{feedback.receiver.name}</p>
                        <p className="text-xs text-muted-foreground">{feedback.receiver.position}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Reconhecimento
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">{feedback.title}</p>
                  <p className="text-sm">{feedback.content}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
