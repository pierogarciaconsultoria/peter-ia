
import { useToast } from "@/components/ui/use-toast";

export function useRecruitmentActions() {
  const { toast } = useToast();

  const handleJobApplication = () => {
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura para a vaga foi recebida com sucesso.",
      duration: 5000,
    });
  };

  const handleCreateJobPost = () => {
    toast({
      title: "Vaga publicada!",
      description: "A vaga agora está disponível publicamente para candidaturas.",
      duration: 5000,
    });
  };

  const copyJobLink = (jobId: string) => {
    const baseUrl = window.location.origin;
    const jobLink = `${baseUrl}/careers/${jobId}`;
    navigator.clipboard.writeText(jobLink);
    toast({
      title: "Link copiado!",
      description: "O link da vaga foi copiado para a área de transferência.",
      duration: 3000,
    });
  };

  return {
    handleJobApplication,
    handleCreateJobPost,
    copyJobLink
  };
}
