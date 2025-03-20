
import React from "react";

export const RiskMatrixLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6 bg-white/80 backdrop-blur-sm p-3 rounded-md border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
        <span className="text-xs font-medium">Crítico</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
        <span className="text-xs font-medium">Alto</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
        <span className="text-xs font-medium">Médio</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
        <span className="text-xs font-medium">Baixo</span>
      </div>
    </div>
  );
};
