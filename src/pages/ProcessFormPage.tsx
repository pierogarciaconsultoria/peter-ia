
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProcessMappingForm } from "@/components/processes/ProcessMappingForm";
import { ReportDialog } from "@/components/processes/ReportDialog";
import { useProcesses } from "@/hooks/useProcesses";
import { toast } from "sonner";

const ProcessFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProcessById } = useProcesses();
  const [showReport, setShowReport] = useState(false);
  const [processData, setProcessData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id && id !== 'novo') {
      // We're editing an existing process
      setIsEditing(true);
      const process = getProcessById(parseInt(id));
      
      if (process) {
        setInitialData(process);
      } else {
        toast.error("Processo não encontrado");
        navigate("/processo");
      }
    }
  }, [id, getProcessById, navigate]);

  const handleFormSubmit = (data) => {
    setProcessData(data);
    setShowReport(true);
  };

  const handleClose = () => {
    setShowReport(false);
    // Navigate back to the processes list after report is closed
    navigate("/processo");
  };

  const handleEditProcess = () => {
    setShowReport(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-5xl mx-auto">
          <ProcessMappingForm 
            onSubmit={handleFormSubmit} 
            initialData={initialData}
            isEditing={isEditing}
          />
        </div>
      </main>

      {showReport && (
        <ReportDialog 
          processData={processData} 
          open={showReport} 
          onClose={handleClose}
          onEdit={handleEditProcess}
          isEditable={true}
          processId={isEditing ? parseInt(id) : null}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProcessFormPage;
