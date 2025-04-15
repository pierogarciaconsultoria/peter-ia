
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployeeSelector } from "../departments/EmployeeSelector";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { generateAssessmentLink } from "@/services/discAssessmentService";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function ExternalDiscAssessmentLink() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Erro ao carregar colaboradores",
        description: "Não foi possível carregar a lista de colaboradores.",
        variant: "destructive",
      });
    }
  };

  const handleEmployeeSelect = async (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (!error && data) {
        setEmployeeData(data);
      } else {
        setEmployeeData(null);
      }
    } else {
      setEmployeeData(null);
    }
  };

  const generateLink = async () => {
    if (!employeeData) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um colaborador",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = await generateAssessmentLink(employeeData.name, employeeData.email);
      setGeneratedLink(link);

      toast({
        title: "Link gerado com sucesso",
        description: "Agora você pode compartilhar o link de avaliação",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar link",
        description: "Ocorreu um erro ao gerar o link de avaliação",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência",
    });
  };

  const sendByEmail = () => {
    if (!employeeData) return;
    
    const emailSubject = encodeURIComponent("Avaliação DISC");
    const emailBody = encodeURIComponent(
      `Olá ${employeeData.name},\n\nAcesse o link para realizar sua avaliação DISC: ${generatedLink}`
    );
    
    window.open(`mailto:${employeeData.email}?subject=${emailSubject}&body=${emailBody}`);
    
    toast({
      title: "E-mail preparado",
      description: "Seu cliente de e-mail foi aberto com o link pronto para envio",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Enviar link externo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar link para avaliação externa</DialogTitle>
          <DialogDescription>
            Crie um link para que o colaborador possa realizar a avaliação DISC
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Selecione o Colaborador</Label>
            <EmployeeSelector
              employeeId={selectedEmployeeId}
              setEmployeeId={handleEmployeeSelect}
              employees={employees}
              error=""
            />
          </div>

          {employeeData && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Dados do Colaborador</Label>
              <div className="text-sm">
                <p><strong>Nome:</strong> {employeeData.name}</p>
                <p><strong>E-mail:</strong> {employeeData.email}</p>
              </div>
            </div>
          )}

          {generatedLink && (
            <Card>
              <CardContent className="pt-4">
                <Label className="text-xs text-muted-foreground">Link de avaliação</Label>
                <div className="flex items-center mt-1">
                  <Input readOnly value={generatedLink} className="pr-10" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-[-40px]" 
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {generatedLink ? (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
              <Button onClick={sendByEmail}>
                <Send className="h-4 w-4 mr-2" />
                Enviar por e-mail
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={generateLink}>
                Gerar link
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
