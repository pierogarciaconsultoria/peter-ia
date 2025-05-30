
import { useParams } from "react-router-dom";
import { ExitInterviewForm } from "@/components/hr/exit-interviews/ExitInterviewForm";

export default function ExitInterviewPage() {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Token não encontrado</h1>
          <p className="text-muted-foreground">
            O link da entrevista parece estar incompleto.
          </p>
        </div>
      </div>
    );
  }

  return <ExitInterviewForm token={token} />;
}
