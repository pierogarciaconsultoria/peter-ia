
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
  height?: string;
}

export function ChartCard({ 
  title, 
  description, 
  children, 
  buttonLabel, 
  onButtonClick,
  height = "300px"
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={`h-[${height}]`}>
          {children}
        </div>
        {buttonLabel && onButtonClick && (
          <div className="mt-2 text-center">
            <Button size="sm" variant="outline" onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
