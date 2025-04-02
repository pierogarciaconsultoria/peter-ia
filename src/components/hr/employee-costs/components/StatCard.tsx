
import { Card, CardContent } from "@/components/ui/card";
import React from 'react';
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: React.ReactNode;
}

export function StatCard({ icon: Icon, iconColor, label, value }: StatCardProps) {
  const bgColorClass = `bg-${iconColor}-500/10`;
  const textColorClass = `text-${iconColor}-500`;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 ${bgColorClass} rounded-full ${textColorClass}`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className={typeof value === 'string' && value.length > 15 ? "text-lg font-semibold" : "text-2xl font-bold"}>
              {value}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
