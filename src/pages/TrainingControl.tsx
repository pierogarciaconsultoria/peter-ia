
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TrainingControl = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the HR Development Tab with proper query parameter
    navigate("/human-resources?activeTab=training");
  }, [navigate]);
  
  return null; // This component will redirect, so no need to render anything
};

export default TrainingControl;
