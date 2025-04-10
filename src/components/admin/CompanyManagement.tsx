
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSuperAdminInLovable } from "@/utils/lovableEditorDetection";
import { executeQuery, verificarEmpresaSalva } from "@/utils/databaseHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
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
import { Building2, Loader2, Plus, Trash2 } from "lucide-react";

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
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");
  const [creatingCompany, setCreatingCompany] = useState(false);
  
  const isEditorSuperAdmin = isSuperAdminInLovable();

  const handleCreateCompany = async () => {
    setCreatingCompany(true);
    try {
      if (!newCompanyName.trim()) {
        throw new Error("O nome da empresa é obrigatório");
      }
      
      let companySlug = newCompanySlug || newCompanyName.toLowerCase().replace(/\s+/g, '-');
      
      if (!isSuperAdmin && !isEditorSuperAdmin) {
        throw new Error("Apenas administradores do sistema podem criar empresas");
      }
      
      let novaEmpresaId: string | null = null;
      
      if (isEditorSuperAdmin) {
        const sqlQuery = `
          INSERT INTO public.companies (
            name, 
            slug, 
            active,
            created_at
          ) VALUES (
            '${newCompanyName}',
            '${companySlug}',
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
        
        setNewCompanyName("");
        setNewCompanySlug("");
      } else {
        try {
          const { data, error } = await supabase
            .from('companies')
            .insert({
              name: newCompanyName,
              slug: companySlug,
              active: true
            })
            .select();
            
          if (error) {
            console.error("Erro no Supabase ao criar empresa:", error);
            
            let errorMessage = "Erro ao criar empresa";
            if (error.message) {
              errorMessage = error.message;
            } else if (error.details) {
              errorMessage = error.details;
            } else if (typeof error === 'object') {
              errorMessage = JSON.stringify(error);
            }
            
            throw new Error(errorMessage);
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
          
          setNewCompanyName("");
          setNewCompanySlug("");
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova empresa no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  placeholder="Nome da Empresa"
                  value={newCompanyName}
                  onChange={(e) => {
                    setNewCompanyName(e.target.value);
                    setNewCompanySlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySlug">Identificador Único (Slug)</Label>
                <Input
                  id="companySlug"
                  placeholder="identificador-unico"
                  value={newCompanySlug}
                  onChange={(e) => setNewCompanySlug(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  O identificador único será usado para URLs e identificação da empresa.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateCompany} disabled={creatingCompany}>
                {creatingCompany ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : 'Criar Empresa'}
              </Button>
            </DialogFooter>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Módulos Ativos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhuma empresa encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          {company.name}
                        </div>
                      </TableCell>
                      <TableCell>{company.slug}</TableCell>
                      <TableCell>
                        {(company.active_modules || []).length > 0 
                          ? company.active_modules.join(', ') 
                          : 'Todos'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          company.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {company.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </TableCell>
                      <TableCell>
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
