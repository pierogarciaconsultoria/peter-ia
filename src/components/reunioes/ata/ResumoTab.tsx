
import { ReuniaoDetalhes, Participante, Acao } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Users } from "lucide-react";
import { formatarData } from "../utils/formatters";

interface ResumoTabProps {
  reuniao: ReuniaoDetalhes | null;
  participantes: Participante[];
  acoes: Acao[];
}

export function ResumoTab({ reuniao, participantes, acoes }: ResumoTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Reunião</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Data e Hora:</span>
              <span>{formatarData(reuniao?.data || '')}</span>
            </div>
            {reuniao?.local && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">Local:</span>
                <span>{reuniao.local}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Participantes:</span>
              <span>{participantes.filter(p => p.presente).length} presentes de {participantes.length} convidados</span>
            </div>
          </div>
          
          {reuniao?.descricao && (
            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Descrição/Pauta</h4>
              <p className="text-sm whitespace-pre-line">{reuniao.descricao}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Reunião</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Atividades Reportadas</h4>
            <p className="text-sm text-muted-foreground">
              {participantes.filter(p => p.presente && p.registro?.o_que_fiz).length} de {participantes.filter(p => p.presente).length} participantes reportaram atividades
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Plano de Ação</h4>
            <p className="text-sm text-muted-foreground">
              {acoes.length} ações registradas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
