
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <h2>1. Introdução</h2>
          <p>
            A presente Política de Privacidade tem por finalidade demonstrar o compromisso da 
            Peter.IA com a privacidade e a proteção dos dados pessoais coletados de seus usuários, 
            estabelecendo as regras sobre a coleta, registro, armazenamento, uso, compartilhamento, 
            enriquecimento e eliminação dos dados coletados dentro do escopo dos serviços e funcionalidades 
            da plataforma, de acordo com as leis em vigor, em especial a Lei nº 13.709/2018 (Lei Geral de 
            Proteção de Dados - LGPD).
          </p>

          <h2>2. Dados Coletados</h2>
          <p>
            Para a prestação de nossos serviços, coletamos os seguintes tipos de dados:
          </p>
          <h3>2.1. Dados de Cadastro</h3>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Senha</li>
            <li>Nome da empresa</li>
          </ul>
          
          <h3>2.2. Dados de Uso</h3>
          <ul>
            <li>Informações sobre como você interage com nossa plataforma</li>
            <li>Dados de login e registros de acesso</li>
            <li>Informações sobre dispositivos e navegadores utilizados</li>
          </ul>

          <h2>3. Finalidades do Tratamento dos Dados</h2>
          <p>Seus dados pessoais serão tratados para as seguintes finalidades:</p>
          <ul>
            <li>Permitir seu acesso e uso da plataforma</li>
            <li>Enviar comunicações sobre seu uso, atualizações do serviço e suporte</li>
            <li>Melhorar nossos serviços e desenvolver novos recursos</li>
            <li>Prevenir fraudes e manter a segurança da plataforma</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>

          <h2>4. Base Legal para o Tratamento</h2>
          <p>
            O tratamento de dados pessoais pela Peter.IA é realizado com base nas seguintes hipóteses autorizativas 
            previstas na LGPD:
          </p>
          <ul>
            <li>Consentimento do titular</li>
            <li>Cumprimento de obrigação legal ou regulatória</li>
            <li>Execução de contrato</li>
            <li>Legítimo interesse</li>
          </ul>

          <h2>5. Armazenamento e Proteção de Dados</h2>
          <p>
            Todos os dados são armazenados em ambiente seguro e controlado. A Peter.IA emprega medidas técnicas 
            e administrativas de segurança para proteger seus dados pessoais contra acessos não autorizados, 
            destruição, perda, alteração, comunicação ou difusão.
          </p>

          <h2>6. Compartilhamento de Dados</h2>
          <p>
            A Peter.IA poderá compartilhar seus dados pessoais nas seguintes situações:
          </p>
          <ul>
            <li>Com fornecedores que precisam acessar os dados para execução dos serviços contratados</li>
            <li>Quando necessário em decorrência de obrigação legal, determinação de autoridade competente, ou decisão judicial</li>
          </ul>

          <h2>7. Direitos dos Titulares</h2>
          <p>
            Em cumprimento à LGPD, a Peter.IA garante aos titulares de dados os seguintes direitos:
          </p>
          <ul>
            <li>Confirmação da existência de tratamento</li>
            <li>Acesso aos dados</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade</li>
            <li>Portabilidade dos dados</li>
            <li>Eliminação dos dados tratados com o consentimento</li>
            <li>Informação sobre entidades públicas e privadas com as quais houve compartilhamento</li>
            <li>Revogação do consentimento</li>
          </ul>

          <h2>8. Exercício dos Direitos do Titular</h2>
          <p>
            Para exercer seus direitos, entre em contato conosco através do e-mail: privacy@peter.ia ou acesse 
            seu perfil na plataforma na seção "Privacidade e Dados".
          </p>

          <h2>9. Período de Retenção</h2>
          <p>
            Os dados pessoais serão mantidos pelo tempo necessário para cumprir as finalidades para as quais foram 
            coletados, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
          </p>

          <h2>10. Mudanças na Política de Privacidade</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos a revisão regular desta página para 
            estar ciente de quaisquer alterações. As alterações entram em vigor imediatamente após sua publicação.
          </p>

          <h2>11. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre suas informações pessoais, entre em 
            contato conosco em: privacy@peter.ia
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
