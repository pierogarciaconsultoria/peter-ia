
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Copy } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CandidateAssessment, generateAssessmentLink } from "@/services/candidateAssessmentService";

interface SendAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: CandidateAssessment;
}

const formSchema = z.object({
  candidate_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  candidate_email: z.string().email("Email inválido"),
});

type FormValues = z.infer<typeof formSchema>;

export function SendAssessmentDialog({ 
  open, 
  onOpenChange,
  assessment
}: SendAssessmentDialogProps) {
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidate_name: "",
      candidate_email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const link = await generateAssessmentLink(
        assessment.id,
        values.candidate_name,
        values.candidate_email
      );
      
      if (link) {
        setGeneratedLink(link);
        toast({
          title: "Link gerado com sucesso",
          description: "Agora você pode enviar o link para o candidato"
        });
      }
    } catch (error) {
      console.error("Error generating assessment link:", error);
      toast({
        title: "Erro ao gerar link",
        description: "Ocorreu um erro ao gerar o link para o candidato",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Avaliação para Candidato</DialogTitle>
          <DialogDescription>
            Gere um link de avaliação para enviar ao candidato
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="candidate_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Candidato</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="candidate_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Candidato</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {generatedLink && (
              <Alert>
                <AlertTitle>Link gerado com sucesso!</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Input 
                      value={generatedLink} 
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      type="button"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este link é válido por 7 dias e pode ser usado apenas uma vez.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
              
              {!generatedLink ? (
                <Button type="submit" disabled={loading}>
                  {loading ? "Gerando..." : "Gerar Link"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
