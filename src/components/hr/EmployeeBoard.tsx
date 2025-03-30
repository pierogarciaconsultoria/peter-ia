
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CalendarDays, 
  Gift, 
  GraduationCap, 
  MessageSquare, 
  Newspaper, 
  Pin, 
  Plus, 
  ThumbsUp, 
  User
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeBoard() {
  // Mock data for announcements
  const [announcements] = useState([
    {
      id: "a1",
      title: "Nova política de home office",
      content: "Estamos felizes em anunciar nossa nova política de trabalho remoto. A partir do próximo mês, todos os funcionários poderão trabalhar de casa até 3 dias por semana...",
      author: "Carlos Mendes - Diretor de RH",
      date: "2023-10-15",
      isPinned: true,
      type: "policy"
    },
    {
      id: "a2",
      title: "Treinamento de segurança da informação",
      content: "Lembramos a todos que o treinamento obrigatório de segurança da informação deve ser concluído até o final do mês...",
      author: "Equipe de TI",
      date: "2023-10-10",
      isPinned: false,
      type: "training"
    },
    {
      id: "a3",
      title: "Confraternização de fim de ano",
      content: "Nossa festa anual de fim de ano será realizada no dia 15/12. Não se esqueça de confirmar sua presença até 30/11...",
      author: "Comitê de Eventos",
      date: "2023-10-05",
      isPinned: true,
      type: "event"
    }
  ]);

  // Mock data for birthdays
  const [birthdays] = useState([
    {
      name: "Ana Oliveira",
      position: "Analista de RH",
      date: "2023-10-25",
      avatar: ""
    },
    {
      name: "João Silva",
      position: "Desenvolvedor React",
      date: "2023-11-03",
      avatar: ""
    },
    {
      name: "Maria Santos",
      position: "Gerente de TI",
      date: "2023-11-10",
      avatar: ""
    }
  ]);

  // Mock data for recognitions
  const [recognitions] = useState([
    {
      id: "r1",
      recipient: {
        name: "Pedro Souza",
        position: "Analista de Marketing",
        avatar: ""
      },
      sender: "Maria Santos",
      message: "Parabéns pelo excelente trabalho na campanha de marketing do último trimestre!",
      date: "2023-10-12"
    },
    {
      id: "r2",
      recipient: {
        name: "Ana Oliveira",
        position: "Analista de RH",
        avatar: ""
      },
      sender: "Carlos Mendes",
      message: "Seu comprometimento com o processo de recrutamento tem sido fundamental para nosso sucesso!",
      date: "2023-10-08"
    }
  ]);

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "policy":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "training":
        return <GraduationCap className="h-5 w-5 text-emerald-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Newspaper className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Mural do Colaborador</h2>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="policy">Políticas</SelectItem>
              <SelectItem value="training">Treinamentos</SelectItem>
              <SelectItem value="event">Eventos</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements">Avisos e Comunicados</TabsTrigger>
          <TabsTrigger value="birthdays">Aniversariantes</TabsTrigger>
          <TabsTrigger value="recognitions">Reconhecimentos</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements" className="space-y-6">
          <div className="space-y-4">
            {announcements
              .filter(a => a.isPinned)
              .map(announcement => (
                <Card key={announcement.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-center">
                        {getAnnouncementIcon(announcement.type)}
                        <div>
                          <CardTitle className="text-base">{announcement.title}</CardTitle>
                          <CardDescription>{announcement.author}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          <Pin className="h-3 w-3 mr-1" />
                          Fixado
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{announcement.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    Publicado em {new Date(announcement.date).toLocaleDateString('pt-BR')}
                  </CardFooter>
                </Card>
              ))}
            
            {announcements
              .filter(a => !a.isPinned)
              .map(announcement => (
                <Card key={announcement.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-center">
                        {getAnnouncementIcon(announcement.type)}
                        <div>
                          <CardTitle className="text-base">{announcement.title}</CardTitle>
                          <CardDescription>{announcement.author}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{announcement.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    Publicado em {new Date(announcement.date).toLocaleDateString('pt-BR')}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="birthdays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2 text-pink-500" />
                Próximos Aniversariantes
              </CardTitle>
              <CardDescription>Celebre o aniversário de seus colegas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {birthdays.map((birthday, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={birthday.avatar} />
                        <AvatarFallback>{birthday.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{birthday.name}</p>
                      <p className="text-sm text-muted-foreground">{birthday.position}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-semibold text-primary">{formatDate(birthday.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(birthday.date) > new Date() ? 'Em breve' : 'Hoje!'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline">Ver Todos os Aniversariantes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Adicione seu Aniversário</CardTitle>
              <CardDescription>Compartilhe a data do seu aniversário com a equipe</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Button className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Adicionar Data de Nascimento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recognitions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2 text-emerald-500" />
                Reconhecimentos Recentes
              </CardTitle>
              <CardDescription>Celebrando as conquistas de nossa equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recognitions.map(recognition => (
                  <div key={recognition.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={recognition.recipient.avatar} />
                        <AvatarFallback>{recognition.recipient.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-grow space-y-2">
                      <div>
                        <span className="font-semibold">{recognition.recipient.name}</span>
                        <span className="text-muted-foreground"> foi reconhecido(a) por </span>
                        <span className="font-semibold">{recognition.sender}</span>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md text-sm italic">
                        "{recognition.message}"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(recognition.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button>
                <ThumbsUp className="h-4 w-4 mr-2" />
                Reconhecer um Colega
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex gap-2 items-center">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <CardTitle className="text-base">Confraternização de fim de ano</CardTitle>
                    <CardDescription>15 de dezembro de 2023</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Nossa festa anual de fim de ano será realizada no restaurante Fasano. Não se esqueça de confirmar sua presença até 30/11.</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">Confirmar Presença</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex gap-2 items-center">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <CardTitle className="text-base">Workshop de Liderança</CardTitle>
                    <CardDescription>20 de novembro de 2023</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Workshop para desenvolvimento de habilidades de liderança, aberto a todos os funcionários interessados em crescimento profissional.</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">Inscrever-se</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex gap-2 items-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-base">Dia da Saúde</CardTitle>
                    <CardDescription>5 de novembro de 2023</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Teremos profissionais de saúde no escritório realizando check-ups gratuitos para todos os funcionários.</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">Agendar Horário</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Adicionar Evento</CardTitle>
                <CardDescription>Compartilhe um evento com a equipe</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Evento
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
