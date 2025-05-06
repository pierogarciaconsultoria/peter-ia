
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="container py-10">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Bem-vindo a Peter.IA</h1>
        <p className="text-xl text-muted-foreground">
          Plataforma de gestão inteligente para sua empresa
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate("/dashboard")}>
            Acessar Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Login / Cadastro
          </Button>
        </div>
      </div>
    </div>
  )
}

export function getIndex() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-3xl p-4">
        <h1 className="text-4xl font-bold">Peter.IA</h1>
        <p className="text-xl text-muted-foreground">
          Gestão inteligente para empresas
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <a href="/dashboard">Acessar Dashboard</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/auth">Login / Cadastro</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
