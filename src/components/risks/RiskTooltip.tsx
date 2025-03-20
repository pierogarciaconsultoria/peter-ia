
import React from "react";
import { RiskPoint } from "./utils/riskMatrixUtils";

interface RiskTooltipProps {
  risk: RiskPoint | null;
  position: { x: number; y: number };
}

export const RiskTooltip: React.FC<RiskTooltipProps> = ({ risk, position }) => {
  if (!risk) return null;
  
  return (
    <div 
      className="absolute bg-white border rounded-md shadow-md p-3 z-50 max-w-[250px]"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y + 10}px`,
        transform: 'translate(-50%, 0)' 
      }}
    >
      <div className="font-bold text-base">{risk.title}</div>
      <div className="text-sm mt-1 font-medium">Processo: <span className="font-normal">{risk.process}</span></div>
      <div className="text-sm font-medium">Nível: <span className="font-normal">{risk.level}</span></div>
      <div className="text-sm font-medium">Status: <span className="font-normal">{risk.status}</span></div>
    </div>
  );
};
