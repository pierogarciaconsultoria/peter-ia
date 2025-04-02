
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProcessMappingForm } from "@/components/processes/ProcessMappingForm";
import { ReportDialog } from "@/components/processes/ReportDialog";

const ProcessFormPage = () => {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [processData, setProcessData] = useState(null);

  const handleFormSubmit = (data) => {
    setProcessData(data);
    setShowReport(true);
  };

  const handleClose = () => {
    setShowReport(false);
    // Navigate back to the processes list after report is closed
    navigate("/processo");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-5xl mx-auto">
          <ProcessMappingForm onSubmit={handleFormSubmit} />
        </div>
      </main>

      {showReport && (
        <ReportDialog processData={processData} open={showReport} onClose={handleClose} />
      )}

      <Footer />
    </div>
  );
};

export default ProcessFormPage;
