
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDiscAssessments, DiscType, DiscScore } from "@/hooks/useDiscAssessments";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  d_score: z.coerce.number().min(0).max(100),
  i_score: z.coerce.number().min(0).max(100),
  s_score: z.coerce.number().min(0).max(100),
  c_score: z.coerce.number().min(0).max(100),
});

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewAssessmentDialog({ 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: NewAssessmentDialogProps) {
  const { createAssessment } = useDiscAssessments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      d_score: 0,
      i_score: 0,
      s_score: 0,
      c_score: 0,
    },
  });
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const scores: DiscScore = {
        D: values.d_score,
        I: values.i_score,
        S: values.s_score,
        C: values.c_score,
      };
      
      // Determine primary type based on highest score
      const scoreEntries = Object.entries(scores) as [DiscType, number][];
      const primaryType = scoreEntries.reduce(
        (max, [type, score]) => score > max.score ? { type, score } : max, 
        { type: 'D' as DiscType, score: -1 }
      ).type;
      
      await createAssessment({
        name: values.name,
        email: values.email,
        scores,
        primary_type: primaryType,
      });
      
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Avaliação DISC</DialogTitle>
          <DialogDescription>
            Cadastre uma nova avaliação DISC. Preencha os dados do participante e suas pontuações.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do participante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Email do participante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="d_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontuação D (Dominante)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="i_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontuação I (Influente)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="s_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontuação S (Estável)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="c_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontuação C (Conformista)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
