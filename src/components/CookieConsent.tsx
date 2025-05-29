
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    
    // Mostrar o banner apenas se o usuário não aceitou anteriormente
    if (!cookiesAccepted) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = async () => {
    // Salvar no localStorage que o usuário aceitou os cookies
    localStorage.setItem("cookiesAccepted", "true");
    
    // Se o usuário estiver logado, atualizar o perfil dele
    if (user) {
      try {
        await supabase
          .from("user_profiles")
          .update({
            lgpd_consent: true,
            lgpd_consent_date: new Date().toISOString()
          })
          .eq("id", user.id);
      } catch (error) {
        console.error("Erro ao atualizar consentimento:", error);
      }
    }
    
    // Fechar o banner
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Usuário não aceitou, mas vamos fechar o banner
    // Em uma implementação mais rigorosa, poderíamos redirecionar para uma página
    // explicando porque não é possível usar o site sem aceitar os cookies essenciais
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 shadow-lg">
      <div className="container flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-sm">
            Utilizamos cookies e tecnologias similares para melhorar sua experiência em nossos serviços, 
            personalizar publicidade e recomendar conteúdo de seu interesse. Ao continuar navegando, você 
            concorda com nossa{" "}
            <a 
              href="/privacy-policy" 
              target="_blank" 
              className="text-primary hover:underline"
            >
              Política de Privacidade
            </a>.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={declineCookies}>
            Recusar
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Aceitar
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setShowConsent(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
