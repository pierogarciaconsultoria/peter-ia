
import React from "react";

export const RiskMatrixLegend: React.FC = () => {
  return (
    <div className="absolute bottom-2 right-2 space-y-1">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
        <span className="text-xs">Crítico</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
        <span className="text-xs">Alto</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
        <span className="text-xs">Médio</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
        <span className="text-xs">Baixo</span>
      </div>
    </div>
  );
};
