
import { Participante } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface ParticipantesTabProps {
  participantes: Participante[];
}

export function ParticipantesTab({ participantes }: ParticipantesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Participantes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participantes.map((participante) => (
            <div key={participante.id} className="border rounded-md p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participante.employee?.avatar_url} />
                  <AvatarFallback>
                    {participante.employee?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-medium">{participante.employee?.name}</div>
                </div>
                
                {participante.presente ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Presente
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Ausente
                  </Badge>
                )}
              </div>
              
              {participante.presente && participante.registro && (
                <div className="space-y-3 text-sm">
                  {participante.registro.o_que_fiz && (
                    <div>
                      <div className="font-medium mb-1">O que fiz:</div>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {participante.registro.o_que_fiz}
                      </div>
                    </div>
                  )}
                  
                  {participante.registro.o_que_vou_fazer && (
                    <div>
                      <div className="font-medium mb-1">O que vou fazer:</div>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {participante.registro.o_que_vou_fazer}
                      </div>
                    </div>
                  )}
                  
                  {participante.registro.dificuldades && (
                    <div>
                      <div className="font-medium mb-1">Dificuldades:</div>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {participante.registro.dificuldades}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
