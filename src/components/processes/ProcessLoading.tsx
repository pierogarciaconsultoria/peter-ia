
import React from "react";
import { Card } from "@/components/ui/card";

export function ProcessLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="opacity-70 animate-pulse">
          <div className="h-24 p-6"></div>
          <div className="h-32 p-6"></div>
          <div className="h-16 p-6"></div>
        </Card>
      ))}
    </div>
  );
}
