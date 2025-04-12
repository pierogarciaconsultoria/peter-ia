
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <HelpCircle className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Ajuda</h1>
      </div>
      
      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          <TabsTrigger value="guides">Guias</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns dos usuários.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como iniciar uma nova Não Conformidade?</AccordionTrigger>
                  <AccordionContent>
                    Para registrar uma nova Não Conformidade, acesse o menu "Não Conformidades" 
                    no painel lateral e clique no botão "Registrar Não Conformidade". Preencha 
                    os campos obrigatórios e clique em Salvar.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Como adicionar um novo usuário?</AccordionTrigger>
                  <AccordionContent>
                    Para adicionar um novo usuário, acesse a página "Administração" no menu 
                    lateral, selecione a aba "Usuários" e clique no botão "Novo Usuário". 
                    Preencha os dados do usuário e defina suas permissões.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como gerenciar documentos?</AccordionTrigger>
                  <AccordionContent>
                    O sistema permite o gerenciamento completo de documentos através do 
                    menu "Documentos". Lá você pode criar, editar, versionar e controlar 
                    a distribuição de documentos como procedimentos, instruções de trabalho, 
                    formulários e manuais da qualidade.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Como agendar uma reunião?</AccordionTrigger>
                  <AccordionContent>
                    No menu "Reuniões", clique no botão "Nova Reunião", preencha os dados 
                    como data, hora, local, pauta e participantes. Após salvar, o sistema 
                    enviará convites por e-mail a todos os participantes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Como criar um plano de ação?</AccordionTrigger>
                  <AccordionContent>
                    Os planos de ação podem ser criados a partir de diversos módulos como 
                    Não Conformidades, Reuniões, Auditorias, entre outros. Basta selecionar 
                    a opção "Criar Plano de Ação" dentro desses módulos.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Guias de Uso</CardTitle>
              <CardDescription>
                Manuais e tutoriais para utilização do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Primeiros Passos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Um guia completo para começar a usar o sistema.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Gestão de Não Conformidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Como gerenciar o ciclo completo de não conformidades.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Controle de Documentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Guia para criação e controle de documentos do SGQ.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Administração do Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Configurações e administração da plataforma.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vídeos Tutoriais</CardTitle>
              <CardDescription>
                Vídeos demonstrativos de como utilizar os principais recursos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Tutorial: Introdução ao Sistema</p>
                </div>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Como Registrar Não Conformidades</p>
                </div>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Gestão de Documentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="support" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Suporte</CardTitle>
              <CardDescription>
                Canais de suporte e contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div>
                  <h3 className="font-medium">E-mail</h3>
                  <p className="text-sm text-muted-foreground">suporte@peter-ia.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-sm text-muted-foreground">(00) 0000-0000</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div>
                  <h3 className="font-medium">Horário de Atendimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta, das 8h às 18h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
