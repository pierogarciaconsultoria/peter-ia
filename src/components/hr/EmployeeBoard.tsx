
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pin, Calendar, Users, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AnnouncementForm } from "./board/AnnouncementForm";

export function EmployeeBoard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userCompany } = useAuth();

  const { data: announcements = [], isLoading, refetch } = useQuery({
    queryKey: ['hr-announcements', userCompany?.id],
    queryFn: async () => {
      if (!userCompany?.id) return [];
      
      const { data, error } = await supabase
        .from('hr_announcements')
        .select(`
          *,
          created_by_profile:user_profiles!hr_announcements_author_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('company_id', userCompany.id)
        .order('is_pinned', { ascending: false })
        .order('publish_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userCompany?.id,
  });

  const handleAddAnnouncement = async (data: any) => {
    try {
      const { error } = await supabase
        .from('hr_announcements')
        .insert([{
          ...data,
          company_id: userCompany?.id,
          author_id: (await supabase.auth.getUser()).data.user?.id,
        }]);

      if (error) throw error;
      
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const getTargetAudienceBadge = (audience: string) => {
    const audiences = {
      all: { label: "Todos", color: "bg-blue-50 text-blue-700 border-blue-200" },
      management: { label: "Gerência", color: "bg-purple-50 text-purple-700 border-purple-200" },
      hr: { label: "RH", color: "bg-green-50 text-green-700 border-green-200" },
      department: { label: "Departamento", color: "bg-orange-50 text-orange-700 border-orange-200" }
    };
    
    const audienceInfo = audiences[audience as keyof typeof audiences] || audiences.all;
    return <Badge variant="outline" className={audienceInfo.color}>{audienceInfo.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">
      <p>Carregando mural...</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Mural do Colaborador</h2>
          <p className="text-muted-foreground">Comunicados e informações importantes</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Comunicado
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Total de Comunicados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Pin className="h-4 w-4 mr-2" />
                Fixados
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(ann => ann.is_pinned).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Ativos
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(ann => 
                !ann.expiry_date || new Date(ann.expiry_date) > new Date()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum comunicado ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando o primeiro comunicado para sua equipe.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Comunicado
              </Button>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className={announcement.is_pinned ? "border-blue-200 bg-blue-50/30" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.is_pinned && (
                        <Pin className="h-4 w-4 text-blue-600" />
                      )}
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(announcement.publish_date)}</span>
                      <span>•</span>
                      <span>Por {announcement.created_by_profile?.first_name || 'Usuário'} {announcement.created_by_profile?.last_name || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTargetAudienceBadge(announcement.target_audience)}
                    {announcement.is_pinned && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Fixado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {announcement.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {announcement.image_url && (
                  <div className="mt-4">
                    <img 
                      src={announcement.image_url} 
                      alt="Imagem do comunicado"
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
                {announcement.expiry_date && new Date(announcement.expiry_date) > new Date() && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Válido até: {formatDate(announcement.expiry_date)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AnnouncementForm 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleAddAnnouncement}
      />
    </div>
  );
}
