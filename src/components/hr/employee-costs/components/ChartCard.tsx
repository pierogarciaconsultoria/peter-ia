
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  height?: number;
}

export function ChartCard({ title, children, height = 300 }: ChartCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </Card>
  );
}
