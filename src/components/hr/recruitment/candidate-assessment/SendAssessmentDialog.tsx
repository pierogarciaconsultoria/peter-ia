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
  FormDescription, 
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
import { generateAssessmentLink } from "@/services/candidateAssessmentService";
import { CandidateAssessment } from "@/types/recruitment";

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  candidateEmail: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SendAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: CandidateAssessment;
}

export function SendAssessmentDialog({ 
  open, 
  onOpenChange,
  assessment
}: SendAssessmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      candidateEmail: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const link = await generateAssessmentLink(
        assessment.id,
        values.candidateName,
        values.candidateEmail
      );
      
      // Open the link in a new tab
      window.open(link, '_blank');
      
      toast({
        title: "Link gerado!",
        description: "O link da avaliação foi gerado com sucesso e aberto em uma nova aba.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar link",
        description: "Ocorreu um erro ao gerar o link da avaliação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Avaliação</DialogTitle>
          <DialogDescription>
            Preencha os dados do candidato para gerar o link da avaliação.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="candidateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Candidato</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="candidateEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Candidato</FormLabel>
                  <FormControl>
                    <Input placeholder="joao@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                Gerar Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
