
import React, { useRef, useEffect } from "react";
import { RiskPoint } from "./utils/riskMatrixUtils";

interface RiskMatrixCanvasProps {
  onRiskHover: (risk: RiskPoint | null, x: number, y: number) => void;
  risks: RiskPoint[];
}

export const RiskMatrixCanvas: React.FC<RiskMatrixCanvasProps> = ({ 
  onRiskHover, 
  risks 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
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
    
    // Add event listener for mouse movement
    canvas.onmousemove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Check if mouse is over any risk point
      let foundRisk = null;
      risks.forEach(risk => {
        const x = (risk.prob + 0.5) * cellWidth;
        const y = (risk.impact + 0.5) * cellHeight;
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        
        if (distance < 15) {
          foundRisk = risk;
          onRiskHover(risk, event.clientX, event.clientY);
        }
      });
      
      if (!foundRisk) {
        onRiskHover(null, 0, 0);
      }
    };
    
    canvas.onmouseleave = () => {
      onRiskHover(null, 0, 0);
    };
    
    // Draw risk points
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
    
  }, [risks, onRiskHover]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full cursor-pointer"
    />
  );
};
