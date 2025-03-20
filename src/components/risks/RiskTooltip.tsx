
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
      className="absolute bg-white border rounded-md shadow-lg p-3 z-50 max-w-[250px] animate-fade-in"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y + 10}px`,
        transform: 'translate(-50%, 0)' 
      }}
    >
      <div className="font-bold text-base text-gray-900">{risk.title}</div>
      <div className="text-sm mt-1 font-medium text-gray-700">Processo: <span className="font-normal text-gray-600">{risk.process}</span></div>
      <div className="text-sm font-medium text-gray-700">Nível: <span className="font-normal text-gray-600">{risk.level}</span></div>
      <div className="text-sm font-medium text-gray-700">Status: <span className="font-normal text-gray-600">{risk.status}</span></div>
    </div>
  );
};
