
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor = "text-muted-foreground",
  buttonLabel,
  onButtonClick
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
            {buttonLabel && onButtonClick && (
              <Button variant="ghost" size="sm" onClick={onButtonClick}>
                {buttonLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
