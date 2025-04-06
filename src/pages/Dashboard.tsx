
import { useState, useEffect } from "react";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { mockRequirements } from "@/utils/isoRequirements";

export default function Dashboard() {
  const [requirements, setRequirements] = useState(mockRequirements);

  useEffect(() => {
    // In a real application, we would fetch the requirements from an API
    // For now, we're using mock data
    setRequirements(mockRequirements);
  }, []);

  return (
    <div className="container py-8">
      <DashboardComponent requirements={requirements} />
    </div>
  );
}
