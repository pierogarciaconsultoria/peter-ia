
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { executeQuery, verificarEmpresaSalva } from "@/utils/databaseHelpers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Loader2, Plus, Trash2, Edit, Phone, Mail, MapPin } from "lucide-react";
import { CompanyForm } from "./CompanyForm";

interface Company {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  active_modules: string[];
  active: boolean;
  address?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  plan?: string;
  potency?: string;
  responsible?: string;
  settings?: any;
}

interface CompanyManagementProps {
  companies: Company[];
  loading: boolean;
  fetchCompanies: () => Promise<void>;
  setItemToDelete: (item: {id: string, type: 'user' | 'company' | 'role'}) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  isSuperAdmin: boolean;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({
  companies,
  loading,
  fetchCompanies,
  setItemToDelete,
  setDeleteDialogOpen,
  isSuperAdmin
}) => {
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
  
  const isEditorSuperAdmin = isSuperAdminInLovable();

  const handleCreateCompany = async (formData: any) => {
    setCreatingCompany(true);
    try {
      if (!isSuperAdmin && !isEditorSuperAdmin) {
        throw new Error("Apenas administradores do sistema podem criar empresas");
      }
      
      let novaEmpresaId: string | null = null;
      
      if (isEditorSuperAdmin) {
        const sqlQuery = `
          INSERT INTO public.companies (
            name, 
            slug, 
            cnpj,
            email,
            phone,
            address,
            responsible,
            plan,
            active_modules,
            active,
            created_at
          ) VALUES (
            '${formData.name}',
            '${formData.slug}',
            ${formData.cnpj ? `'${formData.cnpj}'` : 'NULL'},
            ${formData.email ? `'${formData.email}'` : 'NULL'},
            ${formData.phone ? `'${formData.phone}'` : 'NULL'},
            ${formData.address ? `'${formData.address}'` : 'NULL'},
            ${formData.responsible ? `'${formData.responsible}'` : 'NULL'},
            '${formData.plan}',
            '{${formData.active_modules.join(',')}}',
            true,
            NOW()
          ) RETURNING *;
        `;
        
        const result = await executeQuery(sqlQuery);
        
        if (!result.success) {
          throw new Error(result.error || "Erro ao criar empresa");
        }
        
        if (result.data && result.data.length > 0) {
          novaEmpresaId = result.data[0].id;
          
          const verificacao = await verificarEmpresaSalva(novaEmpresaId);
          if (!verificacao.success) {
            console.error("Verificação de empresa falhou:", verificacao.error);
            throw new Error("A empresa foi criada mas não pôde ser verificada no banco de dados");
          } else {
            console.log("Empresa verificada com sucesso:", verificacao.company);
          }
        } else {
          throw new Error("Empresa criada mas nenhum ID retornado");
        }
        
        toast.success("Empresa criada com sucesso");
        setCompanyDialogOpen(false);
        await fetchCompanies();
      } else {
        try {
          const { data, error } = await supabase
            .from('companies')
            .insert({
              name: formData.name,
              slug: formData.slug,
              cnpj: formData.cnpj || null,
              email: formData.email || null,
              phone: formData.phone || null,
              address: formData.address || null,
              responsible: formData.responsible || null,
              plan: formData.plan,
              active_modules: formData.active_modules,
              active: true
            })
            .select();
            
          if (error) {
            console.error("Erro no Supabase ao criar empresa:", error);
            throw new Error(error.message || "Erro ao criar empresa");
          }
          
          if (data && data.length > 0) {
            novaEmpresaId = data[0].id;
            console.log("Nova empresa criada:", data[0]);
            toast.success("Empresa criada com sucesso");
          } else {
            console.error("Empresa criada mas nenhum dado retornado");
            throw new Error("Empresa criada mas nenhum ID retornado");
          }
          
          setCompanyDialogOpen(false);
          await fetchCompanies();
        } catch (supabaseError: any) {
          console.error("Erro completo do Supabase:", supabaseError);
          throw supabaseError;
        }
      }
    } catch (error: any) {
      console.error("Erro detalhado ao criar empresa:", error);
      
      let errorMessage = "Erro ao criar empresa";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = error.message || error.details || JSON.stringify(error);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    } finally {
      setCreatingCompany(false);
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'default';
      case 'professional': return 'secondary';
      case 'basic': return 'outline';
      default: return 'outline';
    }
  };

  const formatModules = (modules: string[]) => {
    if (!modules || modules.length === 0) return 'Nenhum módulo';
    if (modules.length > 3) return `${modules.slice(0, 3).join(', ')} +${modules.length - 3}`;
    return modules.join(', ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Empresas</CardTitle>
          <CardDescription>Gerenciar empresas do sistema</CardDescription>
        </div>
        <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha todas as informações da empresa
              </DialogDescription>
            </DialogHeader>
            <CompanyForm
              onSubmit={handleCreateCompany}
              isLoading={creatingCompany}
              onCancel={() => setCompanyDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Módulos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma empresa encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{company.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {company.slug}
                            {company.cnpj && ` • ${company.cnpj}`}
                          </div>
                          {company.responsible && (
                            <div className="text-xs text-muted-foreground">
                              Resp.: {company.responsible}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {company.email && (
                            <div className="flex items-center text-xs">
                              <Mail className="mr-1 h-3 w-3" />
                              {company.email}
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center text-xs">
                              <Phone className="mr-1 h-3 w-3" />
                              {company.phone}
                            </div>
                          )}
                          {company.address && (
                            <div className="flex items-center text-xs">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span className="truncate max-w-[150px]" title={company.address}>
                                {company.address}
                              </span>
                            </div>
                          )}
                          {!company.email && !company.phone && !company.address && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(company.plan || 'free')}>
                          {company.plan === 'enterprise' ? 'Enterprise' :
                           company.plan === 'professional' ? 'Profissional' :
                           company.plan === 'basic' ? 'Básico' : 'Gratuito'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs" title={(company.active_modules || []).join(', ')}>
                          {formatModules(company.active_modules || [])}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          company.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {company.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // TODO: Implementar edição
                              toast.info("Funcionalidade de edição em desenvolvimento");
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setItemToDelete({ id: company.id, type: 'company' });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyManagement;
