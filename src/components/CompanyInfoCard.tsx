
import { useCompanyData } from "@/hooks/useCompanyData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Building2, ListChecks, Globe } from "lucide-react";

export function CompanyInfoCard() {
  const { company, loading } = useCompanyData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span>Informações da Empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">
            Nenhuma empresa vinculada encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  // Formatar CNPJ (assumindo formato brasileiro XX.XXX.XXX/XXXX-XX)
  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "Não informado";
    
    // Limpar caracteres não numéricos
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    
    // Garantir que temos 14 dígitos
    if (cleanCnpj.length !== 14) return cnpj;
    
    // Formatar como XX.XXX.XXX/XXXX-XX
    return cleanCnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <span>Informações da Empresa</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1">
          <p className="font-medium text-lg">{company.nome}</p>
          <p className="text-sm text-muted-foreground">CNPJ: {formatCNPJ(company.cnpj)}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Ativo
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <ListChecks className="h-3 w-3" />
            ID: {company.id}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
