
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RiskMatrixCanvas } from "./RiskMatrixCanvas";
import { RiskTooltip } from "./RiskTooltip";
import { RiskMatrixLegend } from "./RiskMatrixLegend";
import { RiskPoint, mapRisksToMatrixPoints } from "./utils/riskMatrixUtils";

export function RiskMatrixChart() {
  const [hoveredRisk, setHoveredRisk] = useState<RiskPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const risks = mapRisksToMatrixPoints();
  
  const handleRiskHover = (risk: RiskPoint | null, x: number, y: number) => {
    setHoveredRisk(risk);
    if (risk) {
      setMousePosition({ x, y });
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full h-[400px] relative p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border border-gray-100">
        <RiskMatrixCanvas 
          onRiskHover={handleRiskHover}
          risks={risks}
        />
        
        {hoveredRisk && (
          <RiskTooltip risk={hoveredRisk} position={mousePosition} />
        )}
      </div>
      
      <RiskMatrixLegend />
    </div>
  );
}
