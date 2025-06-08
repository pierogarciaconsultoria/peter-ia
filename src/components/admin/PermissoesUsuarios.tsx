
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { User, ShieldCheck, Building2 } from "lucide-react";

interface UsuarioPermissao {
  id: string;
  nome: string;
  email: string;
  empresa_id: string | null;
  empresa_nome?: string;
  is_master: boolean;
  is_admin: boolean;
  permissoes: {
    modulo_id: string;
    modulo_nome: string;
    modulo_chave: string;
    pode_visualizar: boolean;
    pode_editar: boolean;
    pode_excluir: boolean;
    pode_criar: boolean;
  }[];
}

export function PermissoesUsuarios() {
  const { user, isMaster, isAdmin, empresaId } = useCurrentUser();
  const { atribuirPermissao } = useUserPermissions();
  const [usuarios, setUsuarios] = useState<UsuarioPermissao[]>([]);
  const [modulos, setModulos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  // Carregar usuários e módulos
  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        
        // Buscar módulos
        const { data: modulosData, error: modulosError } = await supabase
          .from('modulos')
          .select('*')
          .eq('ativo', true);
          
        if (modulosError) throw modulosError;
        setModulos(modulosData || []);
        
        // Buscar usuários
        let query = supabase.from('usuarios').select('*');
        
        // Se não for master, filtrar por empresa
        if (!isMaster && empresaId) {
          query = query.eq('empresa_id', empresaId);
        }
        
        const { data: usuariosData, error: usuariosError } = await query;
        if (usuariosError) throw usuariosError;
        
        // Carregar empresas para associar aos usuários
        const { data: empresasData } = await supabase.from('empresas').select('id, nome');
        const empresasMap = (empresasData || []).reduce((acc, empresa) => {
          acc[empresa.id] = empresa.nome;
          return acc;
        }, {} as Record<string, string>);
        
        // Carregar permissões para cada usuário
        const usuariosComPermissoes = await Promise.all((usuariosData || []).map(async (usuario) => {
          const { data: permissoesData } = await supabase
            .from('permissoes_usuario')
            .select(`
              modulo_id,
              pode_visualizar,
              pode_editar,
              pode_excluir,
              pode_criar,
              modulos:modulo_id (
                id, 
                nome, 
                chave
              )
            `)
            .eq('usuario_id', usuario.id);
            
          const permissoes = (permissoesData || []).map(permissao => ({
            modulo_id: permissao.modulo_id,
            modulo_nome: permissao.modulos?.nome || '',
            modulo_chave: permissao.modulos?.chave || '',
            pode_visualizar: permissao.pode_visualizar,
            pode_editar: permissao.pode_editar,
            pode_excluir: permissao.pode_excluir,
            pode_criar: permissao.pode_criar,
          }));
          
          return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            empresa_id: usuario.empresa_id,
            empresa_nome: usuario.empresa_id ? empresasMap[usuario.empresa_id] : undefined,
            is_master: usuario.is_master || false,
            is_admin: usuario.is_admin || false,
            permissoes,
          };
        }));
        
        setUsuarios(usuariosComPermissoes);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Falha ao carregar usuários e permissões");
      } finally {
        setCarregando(false);
      }
    }
    
    carregarDados();
  }, [isMaster, isAdmin, empresaId]);

  // Atualizar permissão de um usuário
  const atualizarPermissao = async (usuarioId: string, moduloId: string, tipo: 'visualizar' | 'editar' | 'excluir' | 'criar', valor: boolean) => {
    try {
      setAtualizando(true);
      
      // Preparar objeto de permissões
      const permissoesObj: any = {};
      permissoesObj[tipo] = valor;
      
      const { success, error } = await atribuirPermissao(usuarioId, moduloId, permissoesObj);
      
      if (!success && error) {
        throw error;
      }
      
      // Atualizar o estado local
      setUsuarios(prev => prev.map(usuario => {
        if (usuario.id === usuarioId) {
          const permissoesAtualizadas = usuario.permissoes.map(permissao => {
            if (permissao.modulo_id === moduloId) {
              return {
                ...permissao,
                [`pode_${tipo}`]: valor
              };
            }
            return permissao;
          });
          
          // Se não existir a permissão para este módulo, adicionar
          const temModulo = permissoesAtualizadas.some(p => p.modulo_id === moduloId);
          if (!temModulo) {
            const modulo = modulos.find(m => m.id === moduloId);
            if (modulo) {
              const novaPermissao = {
                modulo_id: moduloId,
                modulo_nome: modulo.nome,
                modulo_chave: modulo.chave,
                pode_visualizar: tipo === 'visualizar' ? valor : false,
                pode_editar: tipo === 'editar' ? valor : false,
                pode_excluir: tipo === 'excluir' ? valor : false,
                pode_criar: tipo === 'criar' ? valor : false,
              };
              permissoesAtualizadas.push(novaPermissao);
            }
          }
          
          return {
            ...usuario,
            permissoes: permissoesAtualizadas
          };
        }
        return usuario;
      }));
      
    } catch (error: any) {
      console.error("Erro ao atualizar permissão:", error);
      toast.error(`Falha ao atualizar permissão: ${error.message}`);
    } finally {
      setAtualizando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <span>Permissões de Usuários</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {carregando ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
            <span>Carregando permissões...</span>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Usuário</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id} className={usuarioSelecionado === usuario.id ? "bg-accent/30" : ""}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{usuario.nome}</div>
                          <div className="text-sm text-muted-foreground">{usuario.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {usuario.empresa_nome ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{usuario.empresa_nome}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {usuario.is_master ? (
                          <Badge variant="destructive">Master</Badge>
                        ) : usuario.is_admin ? (
                          <Badge>Administrador</Badge>
                        ) : (
                          <Badge variant="secondary">Usuário</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={usuarioSelecionado === usuario.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUsuarioSelecionado(usuarioSelecionado === usuario.id ? null : usuario.id)}
                          disabled={usuario.is_master && !isMaster}
                        >
                          {usuarioSelecionado === usuario.id ? "Fechar" : "Gerenciar Permissões"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {usuarioSelecionado && (
              <div className="mt-8 border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">
                  Permissões de{" "}
                  {usuarios.find(u => u.id === usuarioSelecionado)?.nome}
                </h3>
                
                <div className="overflow-x-auto mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Módulo</TableHead>
                        <TableHead className="text-center">Visualizar</TableHead>
                        <TableHead className="text-center">Editar</TableHead>
                        <TableHead className="text-center">Excluir</TableHead>
                        <TableHead className="text-center">Criar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modulos.map((modulo) => {
                        const usuarioAtual = usuarios.find(u => u.id === usuarioSelecionado);
                        if (!usuarioAtual) return null;
                        
                        const permissao = usuarioAtual.permissoes.find(
                          p => p.modulo_id === modulo.id
                        );
                        
                        // Se usuário for master ou admin, tem todas as permissões
                        const isUserMasterOrAdmin = usuarioAtual.is_master || usuarioAtual.is_admin;
                        
                        return (
                          <TableRow key={modulo.id}>
                            <TableCell>
                              <div className="font-medium">{modulo.nome}</div>
                              <div className="text-xs text-muted-foreground">{modulo.chave}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={isUserMasterOrAdmin || (permissao?.pode_visualizar || false)}
                                disabled={isUserMasterOrAdmin || atualizando}
                                onCheckedChange={(checked) => {
                                  atualizarPermissao(
                                    usuarioSelecionado, 
                                    modulo.id, 
                                    'visualizar', 
                                    Boolean(checked)
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={isUserMasterOrAdmin || (permissao?.pode_editar || false)}
                                disabled={isUserMasterOrAdmin || atualizando}
                                onCheckedChange={(checked) => {
                                  atualizarPermissao(
                                    usuarioSelecionado, 
                                    modulo.id, 
                                    'editar', 
                                    Boolean(checked)
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={isUserMasterOrAdmin || (permissao?.pode_excluir || false)}
                                disabled={isUserMasterOrAdmin || atualizando}
                                onCheckedChange={(checked) => {
                                  atualizarPermissao(
                                    usuarioSelecionado, 
                                    modulo.id, 
                                    'excluir', 
                                    Boolean(checked)
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={isUserMasterOrAdmin || (permissao?.pode_criar || false)}
                                disabled={isUserMasterOrAdmin || atualizando}
                                onCheckedChange={(checked) => {
                                  atualizarPermissao(
                                    usuarioSelecionado, 
                                    modulo.id, 
                                    'criar', 
                                    Boolean(checked)
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
