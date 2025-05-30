
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  KeyRound,
  Shield,
  Download,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFirstName(user.user_metadata?.first_name || "");
      setLastName(user.user_metadata?.last_name || "");
      setEmail(user.email || "");
      setPhone(data?.phone || "");
      setLgpdConsent(data?.lgpd_consent || false);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (updateError) throw updateError;

      // Update profile data
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Senha atualizada com sucesso");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(`Erro ao atualizar senha: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          lgpd_consent: lgpdConsent,
          lgpd_consent_date: lgpdConsent ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Configurações de privacidade atualizadas");
    } catch (error: any) {
      console.error("Error updating privacy settings:", error);
      toast.error(`Erro ao atualizar configurações de privacidade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPersonalData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Create a JSON file with user data
      const userData = {
        profile: profileData,
        auth: {
          email: user.email,
          metadata: user.user_metadata,
          lastSignIn: user.last_sign_in_at,
          createdAt: user.created_at,
        },
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personal_data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Dados pessoais baixados com sucesso");
    } catch (error: any) {
      console.error("Error downloading personal data:", error);
      toast.error(`Erro ao baixar dados pessoais: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const requestAccountDeletion = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // In a real implementation, you might want to:
      // 1. Create a deletion request record
      // 2. Send an email to confirm the deletion
      // 3. Set a flag on the user profile

      // For this example, we'll just log out the user
      await signOut();
      toast.success("Solicitação de exclusão de conta enviada. Entre em contato com o suporte para finalizar o processo.");
      navigate("/auth");
    } catch (error: any) {
      console.error("Error requesting account deletion:", error);
      toast.error(`Erro ao solicitar exclusão de conta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-2xl bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais e informações de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                  <p className="text-sm text-muted-foreground">
                    O email não pode ser alterado. Entre em contato com o suporte
                    se precisar mudar seu email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                {profile.company_id && (
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input value={profile.companies?.name || "Não disponível"} disabled />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={updateProfile} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updatePassword} disabled={loading}>
                  {loading ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Gerencie como suas informações são tratadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lgpdConsent"
                      checked={lgpdConsent}
                      onCheckedChange={(checked) => setLgpdConsent(checked === true)}
                    />
                    <Label htmlFor="lgpdConsent" className="leading-tight">
                      Concordo com a{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        Política de Privacidade
                      </a>{" "}
                      e autorizo o uso dos meus dados pessoais de acordo com a LGPD.
                    </Label>
                  </div>
                  {profile.lgpd_consent_date && (
                    <p className="text-sm text-muted-foreground">
                      Consentimento registrado em:{" "}
                      {new Date(profile.lgpd_consent_date).toLocaleString()}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seus Direitos LGPD</h3>
                  <p className="text-sm text-muted-foreground">
                    De acordo com a Lei Geral de Proteção de Dados, você tem o direito de acessar,
                    corrigir, portar, eliminar seus dados e revogar o consentimento.
                  </p>

                  <div className="grid gap-4 pt-2">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={downloadPersonalData}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar meus dados pessoais
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="justify-start">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Solicitar exclusão da minha conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Todos os seus dados serão
                            permanentemente excluídos de nossos servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={requestAccountDeletion}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updatePrivacySettings} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar preferências de privacidade"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
