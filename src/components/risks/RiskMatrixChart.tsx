
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { mockRisks } from "./RisksList";

export function RiskMatrixChart() {
  const canvasRef = useRef(null);
  const [hoveredRisk, setHoveredRisk] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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
      { id: "1", prob: 2, impact: 0, label: "R1", title: "Falha em equipamento crítico", level: "Crítico", process: "Produção", status: "Aberto" }, // High prob, high impact
      { id: "2", prob: 1, impact: 0, label: "R2", title: "Perda de fornecedor principal", level: "Alto", process: "Compras", status: "Em tratamento" }, // Medium prob, high impact
      { id: "3", prob: 0, impact: 0, label: "R3", title: "Não conformidade regulatória", level: "Médio", process: "Qualidade", status: "Tratado" }, // Low prob, high impact
      { id: "4", prob: 1, impact: 1, label: "R4", title: "Falha no sistema ERP", level: "Médio", process: "TI", status: "Monitorando" }, // Medium prob, medium impact
      { id: "5", prob: 2, impact: 2, label: "R5", title: "Queda de energia prolongada", level: "Médio", process: "Infraestrutura", status: "Em tratamento" }  // High prob, low impact
    ];
    
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
          setMousePosition({ x: event.clientX, y: event.clientY });
        }
      });
      
      setHoveredRisk(foundRisk);
    };
    
    canvas.onmouseleave = () => {
      setHoveredRisk(null);
    };
    
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

  // Get risks by level for hovering over cells
  const getRisksByLevel = (level) => {
    return mockRisks.filter(risk => risk.level === level);
  };
  
  return (
    <div className="w-full h-[400px] relative p-10">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
      />
      
      {hoveredRisk && (
        <div 
          className="absolute bg-white border rounded-md shadow-md p-3 z-50"
          style={{ 
            left: `${mousePosition.x}px`, 
            top: `${mousePosition.y + 10}px`,
            transform: 'translate(-50%, 0)' 
          }}
        >
          <div className="font-bold">{hoveredRisk.title}</div>
          <div className="text-sm">Processo: {hoveredRisk.process}</div>
          <div className="text-sm">Nível: {hoveredRisk.level}</div>
          <div className="text-sm">Status: {hoveredRisk.status}</div>
        </div>
      )}
      
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
