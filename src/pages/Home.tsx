import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, BrainCircuit, BarChart, Users, Briefcase, ChevronRight, MessageSquare, Star, Play, Shield, Zap, Target, ArrowRight, Clock, TrendingUp, Award, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCTAClick = () => {
    window.open("https://wa.me/5548999115698?text=Olá! Estou interessado em saber mais sobre a plataforma Peter.IA", "_blank");
  };
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate email capture
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      window.open("https://wa.me/5548999115698?text=Olá! Me cadastrei com o email " + email + " e gostaria de saber mais sobre a Peter.IA", "_blank");
    }, 1000);
  };
  return <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header Otimizado */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">Peter.IA</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">BETA</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => document.getElementById('beneficios')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Benefícios
            </Button>
            <Button variant="ghost" onClick={() => document.getElementById('casos-sucesso')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Cases
            </Button>
            <Button variant="ghost" onClick={() => document.getElementById('precos')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Preços
            </Button>
            <Link to="/auth" className="text-sm font-medium hover:underline">Login</Link>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link to="/auth">Teste Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section Otimizado */}
      <section className="container py-20 md:py-32 flex flex-col items-center text-center space-y-8">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Star className="h-4 w-4" />
            +1.000 empresas já transformaram sua gestão
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter">
            Gestão Inteligente que <span className="text-primary">Multiplica Resultados</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A primeira plataforma brasileira que integra <strong>IA,Planejamento Estratégico, Processos, ISO 9001 e Gente e Gestão </strong> 
            em uma solução completa para empresas que querem crescer de forma sustentável.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              Teste grátis por 30 dias
              <Check className="h-4 w-4 text-green-600" />
              Sem cartão de crédito
              <Check className="h-4 w-4 text-green-600" />
              Suporte especializado
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleCTAClick} className="gap-2 bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
            <MessageSquare className="h-5 w-5" />
            Falar com Especialista Agora
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
            <Link to="/auth">
              <Play className="h-5 w-5 mr-2" />
              Ver Demo Gratuita
            </Link>
          </Button>
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 opacity-60">
          <div className="text-center">
            <div className="text-2xl font-bold">+1.000</div>
            <div className="text-sm text-muted-foreground">Empresas Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">3x</div>
            <div className="text-sm text-muted-foreground">Aumento Produtividade</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">30 dias</div>
            <div className="text-sm text-muted-foreground">ROI Médio</div>
          </div>
        </div>
      </section>

      {/* Seção de Problemas */}
      <section className="bg-muted/30 py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600">Pare de Perder Dinheiro com Gestão Ineficiente</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empresas brasileiras perdem em média <strong>R$ 240 mil por ano</strong> devido a processos desorganizados, 
              falta de controle de qualidade e gestão de pessoas inadequada.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ProblemCard title="Processos Desorganizados" description="Retrabalho, perda de prazos e clientes insatisfeitos consomem 40% do tempo da sua equipe." cost="R$ 8.000/mês" />
            <ProblemCard title="Gestão de RH Manual" description="Planilhas desatualizadas, alta rotatividade e compliance em risco geram multas constantes." cost="R$ 12.000/mês" />
            <ProblemCard title="Falta de Estratégia Clara" description="Decisões baseadas em 'achismo' levam a investimentos errados e oportunidades perdidas." cost="R$ 20.000/mês" />
          </div>
        </div>
      </section>

      {/* Features Section Otimizado */}
      <section id="beneficios" className="container py-20 space-y-16">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            A Solução Completa que sua Empresa Precisa
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mais de 15 módulos integrados em uma única plataforma, 
            potencializados por IA para resultados excepcionais.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<Target className="h-10 w-10 text-primary" />} title="Planejamento Estratégico IA" description="SWOT automático, BSC inteligente e OKRs que se ajustam conforme seus resultados." benefit="+85% precisão nas metas" />
          <FeatureCard icon={<Award className="h-10 w-10 text-primary" />} title="ISO 9001 Automatizada" description="Certificação simplificada com IA que gera documentos, monitora processos e garante compliance." benefit="Certificação em 60 dias" />
          <FeatureCard icon={<Users className="h-10 w-10 text-primary" />} title="RH Inteligente" description="Recrutamento com IA, análise DISC automática e gestão completa do ciclo de vida do colaborador." benefit="-70% turnover" />
          <FeatureCard icon={<TrendingUp className="h-10 w-10 text-primary" />} title="Análises Preditivas" description="IA que antecipa problemas, sugere melhorias e otimiza processos automaticamente." benefit="+150% produtividade" />
        </div>

        <div className="text-center">
          <Button size="lg" onClick={handleCTAClick} className="bg-red-600 hover:bg-red-700">
            Quero Transformar Minha Empresa Agora
          </Button>
        </div>
      </section>

      {/* Casos de Sucesso */}
      <section id="casos-sucesso" className="bg-muted/50 py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Resultados Reais de Empresas Reais</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard company="Metalúrgica Santos" result="+300% produtividade" quote="Em 3 meses conseguimos nossa ISO 9001 e reduzimos retrabalho em 80%. O ROI foi imediato." author="João Silva, CEO" />
            <TestimonialCard company="Tech Solutions" result="-85% turnover" quote="O módulo de RH revolucionou nossa gestão de pessoas. Antes perdíamos 2 funcionários por mês." author="Maria Santos, RH" />
            <TestimonialCard company="Construtora Alpha" result="+250% lucro" quote="O planejamento estratégico com IA nos ajudou a identificar oportunidades que não víamos." author="Carlos Mendes, Diretor" />
          </div>
        </div>
      </section>

      {/* Urgência e Escassez */}
      <section className="bg-red-600 text-white py-16">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            🔥 Oferta Limitada: Apenas 50 Vagas Disponíveis
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Implementação gratuita + 3 meses de consultoria especializada + Certificação ISO garantida.
            <strong> Valor: R$ 15.000 - GRÁTIS para os próximos 50 clientes.</strong>
          </p>
          <div className="flex items-center justify-center gap-4">
            <Clock className="h-6 w-6" />
            <span className="text-lg font-bold">Restam apenas 23 vagas</span>
          </div>
          <Button size="lg" variant="secondary" onClick={handleCTAClick} className="text-red-600 font-bold text-lg px-8">
            GARANTIR MINHA VAGA AGORA
          </Button>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="container py-20">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <h3 className="text-2xl font-bold">🎁 Baixe Grátis: Kit Completo de Gestão Empresarial</h3>
            <p className="text-muted-foreground">
              + de 50 templates prontos: ISO 9001, RH, Planejamento Estratégico e mais
            </p>
            <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Seu melhor e-mail" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1" />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Baixar Grátis"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              Seus dados estão seguros. Não enviamos spam.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Perguntas Frequentes</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FAQItem question="A Peter.IA substitui meu ERP atual?" answer="Não, a Peter.IA complementa seu ERP focando em gestão da qualidade, RH e planejamento estratégico com IA." />
            <FAQItem question="Quanto tempo para ver resultados?" answer="Nossos clientes veem primeiros resultados em 7 dias e ROI completo em até 30 dias." />
            <FAQItem question="Preciso de conhecimento técnico?" answer="Zero conhecimento técnico necessário. Interface intuitiva + suporte especializado incluso." />
            <FAQItem question="Funciona para qual tamanho de empresa?" answer="Desde micro empresas até corporações. Nossa IA se adapta ao seu contexto e necessidades." />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto">
            Pare de Perder Dinheiro com Gestão Ineficiente
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Junte-se a +1.000 empresas que já transformaram seus resultados. 
            Comece hoje mesmo - <strong>sem riscos, sem compromisso.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleCTAClick} className="text-primary font-bold text-lg px-8">
              <PhoneCall className="h-5 w-5 mr-2" />
              FALAR COM ESPECIALISTA AGORA
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/auth">
                Começar Teste Grátis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Peter.IA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A primeira plataforma brasileira de gestão inteligente com IA.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produto</h4>
              <div className="space-y-2 text-sm">
                <div>Planejamento Estratégico</div>
                <div>Gestão da Qualidade</div>
                <div>Recursos Humanos</div>
                <div>Análises com IA</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Empresa</h4>
              <div className="space-y-2 text-sm">
                <div>Sobre Nós</div>
                <div>Cases de Sucesso</div>
                <div>Blog</div>
                <div>Carreiras</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Contato</h4>
              <div className="space-y-2 text-sm">
                <div>contato@pierogarcia.com.br</div>
                <div>(48) 99911-5698</div>
                <div>@pierogarciaconsultoria</div>
                <div>www.pierogarcia.com.br</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Peter.IA - Todos os direitos reservados
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div>Política de Privacidade</div>
              <div>Termos de Uso</div>
              <div>LGPD</div>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}
function FeatureCard({
  icon,
  title,
  description,
  benefit
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
}) {
  return <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 flex flex-col items-center text-center h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="font-bold text-xl mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4 flex-1">{description}</p>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {benefit}
        </div>
      </CardContent>
    </Card>;
}
function ProblemCard({
  title,
  description,
  cost
}: {
  title: string;
  description: string;
  cost: string;
}) {
  return <Card className="border-red-200">
      <CardContent className="pt-6 text-center">
        <h3 className="font-bold text-xl mb-3 text-red-600">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg font-bold">
          Prejuízo: {cost}
        </div>
      </CardContent>
    </Card>;
}
function TestimonialCard({
  company,
  result,
  quote,
  author
}: {
  company: string;
  result: string;
  quote: string;
  author: string;
}) {
  return <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
          </div>
          <span className="font-bold text-green-600">{result}</span>
        </div>
        <p className="text-muted-foreground mb-4">"{quote}"</p>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{company}</div>
        </div>
      </CardContent>
    </Card>;
}
function FAQItem({
  question,
  answer
}: {
  question: string;
  answer: string;
}) {
  return <div className="space-y-2">
      <h4 className="font-semibold">{question}</h4>
      <p className="text-muted-foreground text-sm">{answer}</p>
    </div>;
}