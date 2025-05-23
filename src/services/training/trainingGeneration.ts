import { supabase } from "@/integrations/supabase/client";
import { Training } from "@/types/training";
import { mapHrTrainingToTraining } from "./trainingMappers";

/**
 * Generate trainings for an employee based on job position requirements
 */
export async function generateTrainingsForEmployee(
  employeeId: string, 
  jobPositionId: string, 
  employeeName: string,
  departmentName: string
): Promise<Training[]> {
  try {
    const { data: jobPosition, error: jobError } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', jobPositionId)
      .single();
    
    if (jobError) throw jobError;
    
    console.log("Job position data:", jobPosition);
    
    const requiredProcedures = Array.isArray((jobPosition as any).required_procedures) 
      ? (jobPosition as any).required_procedures 
      : [];
      
    if (requiredProcedures.length === 0) {
      console.log("No required procedures found for this position:", jobPositionId);
      return [];
    }

    const { data: documents, error: docError } = await supabase
      .from('iso_documents')
      .select('*')
      .in('id', requiredProcedures);
      
    if (docError) throw docError;
    
    if (!documents || documents.length === 0) {
      console.log("No documents found for the required procedures:", requiredProcedures);
      return [];
    }
    
    const trainings: Training[] = [];
    
    for (const doc of documents) {
      const newTrainingData = {
        title: `Treinamento: ${doc.title}`,
        description: `Treinamento baseado no documento ${doc.document_code || doc.title}`,
        instructor: "A definir", // Map to trainer in our interface
        start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Map to training_date
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 2,
        department: departmentName,
        status: 'planned' as const,
        procedure_id: doc.id,
        evaluation_method: "A definir",
        participants: [
          {
            id: employeeId,
            name: employeeName,
            status: 'confirmed'
          }
        ],
        type: 'required', // Default value for required field
        company_id: (jobPosition as any).company_id // Adding the required company_id field
      };
      
      const { data, error } = await supabase
        .from('hr_trainings')
        .insert(newTrainingData)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating training for document:", doc.title, error);
        continue;
      }
      
      // Convert the returned data to our Training interface
      const newTraining: Training = mapHrTrainingToTraining(data);
      
      trainings.push(newTraining);
    }
    
    return trainings;
  } catch (error) {
    console.error("Error generating trainings for employee:", error);
    throw error;
  }
}

/**
 * Generate a certificate for a completed training
 */
export async function generateTrainingCertificate(trainingId: string, employeeId: string): Promise<string> {
  try {
    // This is a placeholder implementation
    // In a real application, this would generate a PDF certificate and possibly store it
    
    // For now, we'll just return a mock URL
    const certificateUrl = `https://example.com/certificates/${trainingId}_${employeeId}.pdf`;
    
    // In a real implementation, we would update the employee_trainings record with the certificate URL
    
    return certificateUrl;
  } catch (error) {
    console.error("Error generating training certificate:", error);
    throw error;
  }
}
