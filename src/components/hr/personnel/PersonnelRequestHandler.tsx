
import { useState } from "react";
import { JobPosition } from "../types";
import { PersonnelRequest, RequestFormValues } from "./types";
import { v4 as uuidv4 } from "uuid";
import { createNotification } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";
import { createTaskInModule } from "./utils/taskUtils";
import { toast } from "sonner";

interface PersonnelRequestHandlerParams {
  onAddRequest: () => void;
  requests: PersonnelRequest[];
  setRequests: React.Dispatch<React.SetStateAction<PersonnelRequest[]>>;
  employees: any[];
  jobPositions: JobPosition[];
}

export function PersonnelRequestHandler({ 
  onAddRequest, 
  requests, 
  setRequests,
  employees,
  jobPositions
}: PersonnelRequestHandlerParams) {
  const { toast } = useToast();

  const handleSubmit = async (data: RequestFormValues) => {
    console.log("Form data submitted:", data);
    
    // Create a new request object from the form data
    const newRequest: PersonnelRequest = {
      id: uuidv4(),
      type: data.type,
      department: data.department,
      position: data.proposedPosition || "",
      position_id: data.position_id || "",
      requestDate: data.requestDate || new Date().toISOString().split('T')[0],
      status: "pending",
      requester: data.requester_id || "Sistema",
      requester_id: data.requester_id || "",
      employeeName: data.employeeName || "",
      employee_id: data.employeeId || "",
      justification: data.justification || ""
    };

    // Add specific fields based on request type
    if (data.type === "Aumento salarial" && data.currentSalary && data.proposedSalary) {
      newRequest.currentSalary = data.currentSalary;
      newRequest.proposedSalary = data.proposedSalary;
    }
    
    // Update the requests state with the new request
    setRequests(prevRequests => [newRequest, ...prevRequests]);
    
    // Creating a task associated with the request with explicitly structured data
    try {
      // Create properly typed transfer object with all necessary fields
      const taskRequestData = {
        id: newRequest.id,
        type: newRequest.type,
        department: newRequest.department,
        requester_id: newRequest.requester_id,
        employee_id: newRequest.employee_id,
        employeeName: newRequest.employeeName,
        justification: newRequest.justification
      };
      
      await createTaskInModule(taskRequestData);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Aviso",
        description: "Solicitação criada, mas houve um erro ao criar a tarefa associada.",
        variant: "destructive"
      });
    }
    
    // Show a success toast
    toast({
      title: "Solicitação criada",
      description: `Solicitação de ${data.type} criada com sucesso.`,
    });
    
    // Send notification to HR department
    try {
      // Find HR manager employees
      const hrManagers = employees.filter(emp => 
        emp.department === "Recursos Humanos" && 
        emp.position && 
        (emp.position.includes("Gerente") || emp.position.includes("Manager"))
      );
      
      // Notify HR managers about the new request
      if (hrManagers && hrManagers.length > 0) {
        for (const manager of hrManagers) {
          if (!manager.id) {
            console.warn("Manager without valid ID:", manager);
            continue;
          }
          
          await createNotification(
            manager.id,
            "Nova Solicitação de Movimentação",
            `Nova solicitação de ${data.type} para ${data.employeeName || 'um colaborador'} foi recebida.`,
            "personnel_request",
            newRequest.id,
            `/human-resources?activeTab=movimentacao`
          );
        }
      } else {
        console.warn("No HR managers found to notify about the new request");
      }
      
      // If this is for a specific employee, notify them as well
      if (data.employeeId) {
        await createNotification(
          data.employeeId,
          "Solicitação em Seu Nome",
          `Uma solicitação de ${data.type} foi aberta em seu nome.`,
          "personnel_request",
          newRequest.id
        );
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
    
    return newRequest;
  };

  return { handleSubmit };
}
