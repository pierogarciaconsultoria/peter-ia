
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentForm } from "./DocumentForm";

interface DocumentUploadCardProps {
  employeeName: string;
  onComplete: () => void;
}

export const DocumentUploadCard = ({ employeeName, onComplete }: DocumentUploadCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Envio de documentos</CardTitle>
        <CardDescription>
          Olá {employeeName}, por favor faça o upload dos documentos necessários para sua admissão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentForm employeeName={employeeName} onSubmit={onComplete} />
      </CardContent>
    </Card>
  );
};
