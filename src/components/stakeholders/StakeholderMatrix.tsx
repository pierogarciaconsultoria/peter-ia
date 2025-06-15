
import React, { useMemo } from "react";
import type { Stakeholder } from "@/services/stakeholderService";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Níveis possíveis
const INFLUENCE_LEVELS = [
  { key: "baixo", label: "Baixo", color: "bg-gray-50" },
  { key: "médio", label: "Médio", color: "bg-blue-50" },
  { key: "alto", label: "Alto", color: "bg-yellow-50" },
  { key: "crítico", label: "Crítico", color: "bg-red-50" },
];

const INTEREST_LEVELS = [
  { key: "baixo", label: "Baixo" },
  { key: "médio", label: "Médio" },
  { key: "alto", label: "Alto" },
];

type StakeholderMatrixProps = {
  stakeholders: Stakeholder[];
};

const colors: Record<string, string> = {
  "baixo|baixo": "bg-gray-100",
  "baixo|médio": "bg-gray-200",
  "baixo|alto": "bg-gray-300",
  "médio|baixo": "bg-blue-100",
  "médio|médio": "bg-blue-200",
  "médio|alto": "bg-blue-300",
  "alto|baixo": "bg-yellow-100",
  "alto|médio": "bg-yellow-200",
  "alto|alto": "bg-yellow-300",
  "crítico|baixo": "bg-red-100",
  "crítico|médio": "bg-red-200",
  "crítico|alto": "bg-red-300",
};

function getQuadrantTitle(influence: string, interest: string) {
  if (influence === "crítico" && interest === "alto") return "Gerenciar muito de perto";
  if (influence === "alto" && interest === "alto") return "Manter próximo";
  if (influence === "médio" && interest === "médio") return "Satisfazer";
  if (interest === "baixo") return "Monitorar";
  if (influence === "baixo" && interest === "médio") return "Informar";
  return "Acompanhar";
}

export function StakeholderMatrix({ stakeholders }: StakeholderMatrixProps) {
  // Agrupar stakeholders por quadrante (influência, interesse)
  const matrix = useMemo(() => {
    const m: Record<string, Record<string, Stakeholder[]>> = {};
    for (const i of INFLUENCE_LEVELS.map(l => l.key)) {
      m[i] = {};
      for (const j of INTEREST_LEVELS.map(l => l.key)) {
        m[i][j] = [];
      }
    }
    for (const s of stakeholders) {
      const infl = INFLUENCE_LEVELS.some(l => l.key === s.influence_level) ? s.influence_level : "baixo";
      const int = INTEREST_LEVELS.some(l => l.key === s.interest_level) ? s.interest_level : "baixo";
      m[infl][int].push(s);
    }
    return m;
  }, [stakeholders]);

  return (
    <div>
      <h2 className="font-bold text-primary text-xl mb-4">Matriz de Stakeholders (Influência x Interesse)</h2>
      <div className="overflow-x-auto mb-6">
        <div className="grid grid-cols-4 min-w-[660px]">
          {/* Cabecalho */}
          <div className="row-span-2"></div>
          <div className="col-span-3 text-center font-semibold text-base pb-2">Nível de Interesse &rarr;</div>
          {/* Rótulo interesse */}
          <div></div>
          {INTEREST_LEVELS.map(level => (
            <div key={level.key} className="text-center font-medium pb-1">{level.label}</div>
          ))}
          {/* Matriz */}
          {INFLUENCE_LEVELS.map(infl => (
            <React.Fragment key={infl.key}>
              {/* Rótulo influência (vertical) */}
              <div className="flex items-center justify-center rotate-[-8deg] font-medium text-sm min-h-[90px]">
                <span className={cn("p-2 rounded", infl.color, "text-xs leading-tight")}>
                  {infl.label}<br/>
                  <span className="text-[10px] text-muted-foreground">Influência</span>
                </span>
              </div>
              {/* Quadrantes */}
              {INTEREST_LEVELS.map(intl => {
                const stks = matrix[infl.key][intl.key];
                const quadrantKey = `${infl.key}|${intl.key}`;
                return (
                  <div
                    key={quadrantKey}
                    className={cn(
                      "border min-h-[90px] p-2 flex flex-wrap gap-1 items-start relative rounded-sm transition-all duration-200",
                      colors[quadrantKey]
                    )}
                  >
                    <div className="absolute right-2 top-2 text-[10px] text-muted-foreground pointer-events-none">
                      {getQuadrantTitle(infl.key, intl.key)}
                    </div>
                    {stks.length === 0 ? (
                      <span className="text-gray-400 text-xs opacity-70 pt-4 block w-full text-center">-</span>
                    ) : (
                      stks.map(s => (
                        <MatrixStakeholderDot key={s.id} stakeholder={s} />
                      ))
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Legenda */}
      <div className="flex flex-wrap gap-4 items-center mt-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-red-300 border border-red-400 inline-block"></span>
          Gerenciar muito de perto
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400 inline-block"></span>
          Manter próximo
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-blue-300 border border-blue-400 inline-block"></span>
          Satisfazer
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400 inline-block"></span>
          Monitorar/Informar
        </div>
      </div>
    </div>
  );
}

// Card/dot do stakeholder com tooltip simples
function MatrixStakeholderDot({ stakeholder }: { stakeholder: Stakeholder }) {
  return (
    <div
      className="group cursor-pointer relative"
      tabIndex={0}
    >
      <div
        className="rounded-full bg-primary text-primary-foreground font-bold w-7 h-7 flex items-center justify-center shadow hover:scale-110 outline-none ring-0 group-focus:ring-2 group-focus:ring-primary transition-all"
        title={stakeholder.name}
      >
        {stakeholder.name?.[0] || "?"}
      </div>
      {/* Tooltip */}
      <div className="absolute z-20 top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border shadow rounded px-2 py-1 text-xs min-w-[110px] text-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus:opacity-100 group-focus:pointer-events-auto transition">
        <div className="font-bold">{stakeholder.name}</div>
        <div>{stakeholder.category}</div>
        <div className="text-primary/60">{stakeholder.type === "interno" ? "Interno" : "Externo"}</div>
        <div className="mt-1 text-muted-foreground">{stakeholder.notes}</div>
      </div>
    </div>
  );
}
