
import { CreateDiscAssessmentParams, DiscAssessment } from "@/types/disc";

const LOCAL_STORAGE_KEY = 'local_disc_assessments';

/**
 * Get locally stored DISC assessments
 */
export function getLocalAssessments(): DiscAssessment[] {
  try {
    const localAssessments = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localAssessments ? JSON.parse(localAssessments) : [];
  } catch (error) {
    console.error("Error getting local assessments:", error);
    return [];
  }
}

/**
 * Save a DISC assessment locally
 */
export function createLocalAssessment(assessment: CreateDiscAssessmentParams): DiscAssessment {
  const localAssessment: DiscAssessment = {
    id: `local-${Date.now()}`,
    name: assessment.name,
    email: assessment.email,
    scores: assessment.scores,
    primary_type: assessment.primary_type,
    invited_by: assessment.invited_by,
    date: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  
  // Store locally
  const localAssessments = getLocalAssessments();
  localAssessments.push(localAssessment);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localAssessments));
  
  return localAssessment;
}

/**
 * Clear all local assessments
 */
export function clearLocalAssessments(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

/**
 * Update a local assessment
 */
export function updateLocalAssessment(id: string, assessmentData: Partial<DiscAssessment>): boolean {
  try {
    const localAssessments = getLocalAssessments();
    const index = localAssessments.findIndex(a => a.id === id);
    
    if (index >= 0) {
      localAssessments[index] = { ...localAssessments[index], ...assessmentData };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localAssessments));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating local assessment:", error);
    return false;
  }
}

/**
 * Delete a local assessment
 */
export function deleteLocalAssessment(id: string): boolean {
  try {
    const localAssessments = getLocalAssessments();
    const filteredAssessments = localAssessments.filter(a => a.id !== id);
    
    if (filteredAssessments.length < localAssessments.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredAssessments));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting local assessment:", error);
    return false;
  }
}
