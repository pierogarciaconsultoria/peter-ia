
import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

export function RiskMatrixChart() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Matrix configuration
    const gridSize = 3;
    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells with colors based on risk level
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Risk level is determined by position in matrix
        // x = probability (0 = low, 2 = high)
        // y = impact (0 = high, 2 = low) - inverted because canvas Y is top to bottom
        
        // Calculate risk level (color)
        let color;
        const riskSum = x + (gridSize - 1 - y);
        
        if (x === 2 && y === 0) {
          // Top right corner - Critical risk
          color = 'rgba(220, 38, 38, 0.7)'; // Red
        } else if (riskSum >= 4) {
          // High risk
          color = 'rgba(234, 88, 12, 0.7)'; // Orange
        } else if (riskSum >= 2) {
          // Medium risk
          color = 'rgba(234, 179, 8, 0.7)'; // Yellow
        } else {
          // Low risk
          color = 'rgba(22, 163, 74, 0.7)'; // Green
        }
        
        // Draw cell
        ctx.fillStyle = color;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        
        // Draw borders
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
    
    // Add labels
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // X-axis label (Probability)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height + 30);
    ctx.fillText('Probabilidade', 0, 0);
    ctx.restore();
    
    // Y-axis label (Impact)
    ctx.save();
    ctx.translate(-30, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Impacto', 0, 0);
    ctx.restore();
    
    // X-axis values
    const xLabels = ['Baixa', 'Média', 'Alta'];
    xLabels.forEach((label, i) => {
      ctx.fillText(label, (i + 0.5) * cellWidth, canvas.height + 15);
    });
    
    // Y-axis values
    const yLabels = ['Alto', 'Médio', 'Baixo'];
    yLabels.forEach((label, i) => {
      ctx.fillText(label, -15, (i + 0.5) * cellHeight);
    });
    
    // Plot sample data points
    const risks = [
      { prob: 2, impact: 0, label: "R1" }, // High prob, high impact
      { prob: 1, impact: 0, label: "R2" }, // Medium prob, high impact
      { prob: 0, impact: 0, label: "R3" }, // Low prob, high impact
      { prob: 1, impact: 1, label: "R4" }, // Medium prob, medium impact
      { prob: 2, impact: 2, label: "R5" }  // High prob, low impact
    ];
    
    risks.forEach(risk => {
      const x = (risk.prob + 0.5) * cellWidth;
      const y = (risk.impact + 0.5) * cellHeight;
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(risk.label, x, y);
    });
    
  }, []);
  
  return (
    <div className="w-full h-[400px] relative p-10">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
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
    </div>
  );
}
