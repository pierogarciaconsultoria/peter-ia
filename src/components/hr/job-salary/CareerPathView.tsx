
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CareerPathView() {
  // Career paths data
  const careerPaths = [
    {
      department: "Tecnologia",
      paths: [
        { level: 1, title: "Desenvolvedor Junior", nextLevel: "Desenvolvedor Pleno" },
        { level: 2, title: "Desenvolvedor Pleno", nextLevel: "Desenvolvedor Senior" },
        { level: 3, title: "Desenvolvedor Senior", nextLevel: "Tech Lead" },
        { level: 4, title: "Tech Lead", nextLevel: "Gerente de Tecnologia" },
        { level: 5, title: "Gerente de Tecnologia", nextLevel: "CTO" }
      ]
    },
    {
      department: "Recursos Humanos",
      paths: [
        { level: 1, title: "Analista de RH Junior", nextLevel: "Analista de RH Pleno" },
        { level: 2, title: "Analista de RH Pleno", nextLevel: "Analista de RH Senior" },
        { level: 3, title: "Analista de RH Senior", nextLevel: "Coordenador de RH" },
        { level: 4, title: "Coordenador de RH", nextLevel: "Gerente de RH" },
        { level: 5, title: "Gerente de RH", nextLevel: "Diretor de RH" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {careerPaths.map((path) => (
        <Card key={path.department}>
          <CardHeader>
            <CardTitle>{path.department}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {path.paths.map((position) => (
                <div key={position.level} className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {position.level}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="h-1 bg-primary"></div>
                  </div>
                  <div className="ml-4 p-3 border rounded-md min-w-[200px]">
                    <p className="font-medium">{position.title}</p>
                    {position.nextLevel && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Próximo nível: {position.nextLevel}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
