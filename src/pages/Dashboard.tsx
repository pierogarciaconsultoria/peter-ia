
import { useState, useEffect } from "react";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { isoRequirements } from "@/utils/isoRequirements";

export default function Dashboard() {
  const [requirements, setRequirements] = useState(isoRequirements);

  useEffect(() => {
    // In a real application, we would fetch the requirements from an API
    // For now, we're using mock data
    setRequirements(isoRequirements);
  }, []);

  return (
    <div className="container py-8">
      <DashboardComponent requirements={requirements} />
    </div>
  );
}
