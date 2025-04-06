
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Building2 } from "lucide-react";
import { useRegistration } from "@/hooks/useRegistration";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

export const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const { 
    firstName,
    setFirstName,
    lastName,
    setLastName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    companyName,
    setCompanyName,
    lgpdConsent,
    setLgpdConsent,
    loading,
    errorDetails,
    handleRegister
  } = useRegistration(setActiveTab);

  return (
    <form onSubmit={handleRegister}>
      <CardContent className="space-y-4">
        {errorDetails && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {errorDetails}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              placeholder="Sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerEmail">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="registerEmail"
              placeholder="seu@email.com"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerPassword">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="registerPassword"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              className="pl-10"
              minLength={6}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da Empresa (opcional)</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyName"
              placeholder="Nome da sua empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Se você for o administrador de uma empresa, digite o nome aqui.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="lgpdConsent" 
            checked={lgpdConsent} 
            onCheckedChange={(checked) => setLgpdConsent(checked === true)}
            required
          />
          <Label 
            htmlFor="lgpdConsent" 
            className="text-sm leading-tight"
          >
            Concordo com a <a href="#" className="text-primary hover:underline" onClick={(e) => {
              e.preventDefault();
              window.open("/privacy-policy", "_blank");
            }}>Política de Privacidade</a> e o uso dos meus dados pessoais de acordo com a LGPD.
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !lgpdConsent}
        >
          {loading ? "Processando..." : "Cadastrar"}
        </Button>
      </CardFooter>
    </form>
  );
};
