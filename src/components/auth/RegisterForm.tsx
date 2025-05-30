
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Lock, User, Building2, Phone, MapPin, FileText, UserCheck } from "lucide-react";
import { useRegistration } from "@/hooks/useRegistration";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

export const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const navigate = useNavigate();
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
    companyCnpj,
    setCompanyCnpj,
    companyAddress,
    setCompanyAddress,
    companyPhone,
    setCompanyPhone,
    companyEmail,
    setCompanyEmail,
    companyResponsible,
    setCompanyResponsible,
    lgpdConsent,
    setLgpdConsent,
    loading,
    errorDetails,
    handleRegister,
    isFreeAccess
  } = useRegistration(setActiveTab);

  // Se estamos no modo de acesso gratuito, mostramos uma mensagem e botão para acessar direto
  if (isFreeAccess) {
    return (
      <CardContent className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          <h3 className="font-medium text-lg mb-2">Acesso Gratuito Disponível</h3>
          <p className="mb-4">
            Você tem acesso gratuito para testar todas as funcionalidades da plataforma sem necessidade de cadastro.
          </p>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => navigate("/")}
          >
            Acessar Plataforma
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Para obter uma conta permanente com seus próprios dados, 
            entre em contato com nossa equipe comercial.
          </p>
        </div>
      </CardContent>
    );
  }

  const showCompanyFields = companyName.trim().length > 0;

  return (
    <form onSubmit={handleRegister}>
      <CardContent className="space-y-6">
        {errorDetails && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {errorDetails}
          </div>
        )}
        
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Dados Pessoais</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                placeholder="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome *</Label>
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
            <Label htmlFor="registerEmail">Email *</Label>
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
            <Label htmlFor="registerPassword">Senha *</Label>
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
        </div>

        {/* Dados da Empresa */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Dados da Empresa (opcional)</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
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
            <p className="text-xs text-muted-foreground">
              Preencha se você representa uma empresa
            </p>
          </div>

          {showCompanyFields && (
            <div className="space-y-4 pl-4 border-l-2 border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyCnpj">CNPJ</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyCnpj"
                      placeholder="00.000.000/0000-00"
                      value={companyCnpj}
                      onChange={(e) => setCompanyCnpj(e.target.value)}
                      className="pl-10"
                      maxLength={18}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyPhone"
                      placeholder="(11) 99999-9999"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="pl-10"
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyEmail"
                    placeholder="contato@empresa.com.br"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyResponsible">Responsável</Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyResponsible"
                    placeholder="Nome do responsável"
                    value={companyResponsible}
                    onChange={(e) => setCompanyResponsible(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Endereço Completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="companyAddress"
                    placeholder="Rua, número, complemento, bairro, cidade - UF, CEP"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="pl-10 min-h-[80px]"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
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
            }}>Política de Privacidade</a> e o uso dos meus dados pessoais de acordo com a LGPD. *
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
