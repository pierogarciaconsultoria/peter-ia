
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, BrainCircuit, BarChart, Users, Briefcase, ChevronRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleCTAClick = () => {
    window.open("https://wa.me/5548999115698?text=Olá! Estou interessado em saber mais sobre a plataforma Peter.IA", "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Peter.IA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:underline">Login</Link>
            <Button asChild>
              <Link to="/auth">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 flex flex-col items-center text-center space-y-10">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Gestão Inteligente Impulsionada por <span className="text-primary">IA</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-[85%] mx-auto">
            Transforme sua empresa com a plataforma integrada inspirada em Peter Drucker 
            e potencializada por inteligência artificial avançada.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleCTAClick} className="gap-2 bg-red-600 hover:bg-red-700">
            Resolver Meus Problemas de Gestão
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth">Experimentar Grátis</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 space-y-16">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Uma Plataforma Completa para sua Gestão</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Combine planejamento estratégico, gestão da qualidade, gestão de processos
            e gestão de pessoas em uma única ferramenta potencializada por IA.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<BarChart className="h-10 w-10 text-primary" />}
            title="Planejamento Estratégico"
            description="Desenvolva estratégias inteligentes com análises preventivas e recomendações baseadas em IA para alcançar resultados superiores."
          />
          <FeatureCard 
            icon={<Briefcase className="h-10 w-10 text-primary" />}
            title="Gestão da Qualidade"
            description="Automatize processos ISO 9001 e monitore indicadores em tempo real com dashboards e alertas inteligentes."
          />
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Gestão de Pessoas"
            description="Otimize a performance da sua equipe com análises comportamentais e recomendações personalizadas por IA."
          />
          <FeatureCard 
            icon={<BrainCircuit className="h-10 w-10 text-primary" />}
            title="IA Avançada"
            description="Decisões mais assertivas com algoritmos de aprendizado de máquina que evoluem com o uso da plataforma."
          />
        </div>
      </section>

      {/* AI Benefits Section */}
      <section className="bg-muted/50 py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Inteligência Artificial a Serviço da Sua Gestão</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A Peter.IA utiliza algoritmos avançados para simplificar processos complexos
              e oferecer insights que humanos sozinhos não conseguiriam.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard 
              title="Análise Preventiva"
              description="Antecipe tendências e comportamentos com modelos preventivos que analisam dados históricos e atuais."
            />
            <BenefitCard 
              title="Automação Inteligente"
              description="Reduza o trabalho manual com automação de processos que se adapta às necessidades específicas da sua empresa."
            />
            <BenefitCard 
              title="Insights Estratégicos"
              description="Receba recomendações personalizadas baseadas nos princípios de Peter Drucker e otimizadas por algoritmos de IA."
            />
            <BenefitCard 
              title="Detecção de Anomalias"
              description="Identifique desvios nos processos antes que se tornem problemas graves, com alertas proativos."
            />
            <BenefitCard 
              title="Processamento de Linguagem Natural"
              description="Comunique-se com a plataforma em linguagem natural e receba respostas claras e acionáveis."
            />
            <BenefitCard 
              title="Aprendizado Contínuo"
              description="A plataforma evolui constantemente, aprendendo com as interações e se tornando mais precisa com o tempo."
            />
          </div>
        </div>
      </section>

      {/* Login/Register Section */}
      <section className="container py-20 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Comece a Transformar sua Gestão Hoje</h2>
          <p className="text-xl text-muted-foreground">
            Entre para nossa comunidade de empresas que utilizam inteligência artificial
            para revolucionar seus processos e resultados.
          </p>
          <Button 
            size="lg" 
            onClick={handleCTAClick} 
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <MessageSquare className="h-4 w-4" />
            Falar com um Especialista
          </Button>
        </div>

        <Card className="flex-1 w-full max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold">Acesse sua Conta</h3>
                <p className="text-muted-foreground">Digite seus dados para entrar na plataforma</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Senha
                  </label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
                <div className="text-center text-sm">
                  <Link to="/auth" className="text-primary hover:underline">
                    Criar uma conta
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
            Pronto para Resolver os Desafios da sua Empresa?
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Deixe a Peter.IA ajudar a sua empresa a alcançar resultados excepcionais com o poder da inteligência artificial aplicada à gestão.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleCTAClick} 
            className="text-primary font-bold text-lg px-8 bg-red-600 hover:bg-red-700 text-white"
          >
            QUERO TRANSFORMAR MINHA EMPRESA AGORA
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Peter.IA</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4">
              <a href="https://www.pierogarcia.com.br" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                www.pierogarcia.com.br
              </a>
              <a href="https://www.instagram.com/pierogarciaconsultoria" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                @pierogarciaconsultoria
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Peter.IA - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 flex flex-col items-center text-center h-full">
        <div className="mb-5">{icon}</div>
        <h3 className="font-bold text-xl mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex-shrink-0">
        <Check className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
