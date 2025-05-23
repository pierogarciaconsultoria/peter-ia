
import { supabase } from "@/integrations/supabase/client";

/**
 * Validates a DISC assessment link by its token
 * @param token The token to validate
 * @returns True if the link is valid, false otherwise
 */
export const validateAssessmentLink = async (token: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("disc_evaluation_links")
      .select("*")
      .eq("token", token)
      .eq("is_used", false)
      .single();
      
    if (error || !data) {
      console.error("Error validating assessment link:", error);
      return false;
    }
    
    // Check if the link has expired
    const expiryDate = new Date(data.expires_at);
    if (expiryDate < new Date()) {
      console.error("Assessment link has expired");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in validateAssessmentLink:", error);
    return false;
  }
};

/**
 * Marks a DISC assessment link as used
 * @param token The token of the link to mark as used
 * @returns True if the operation was successful, false otherwise
 */
export const markAssessmentLinkAsUsed = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("disc_evaluation_links")
      .update({ is_used: true })
      .eq("token", token);
      
    if (error) {
      console.error("Error marking assessment link as used:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in markAssessmentLinkAsUsed:", error);
    return false;
  }
};

/**
 * Generates an external assessment link
 * @param name The name of the recipient
 * @param email The email of the recipient
 * @returns The generated link
 */
export async function generateAssessmentLink(name: string, email: string): Promise<string> {
  // Generate a unique token
  const token = crypto.randomUUID();
  
  // In a real implementation, would save to the database
  // For now, simulate a link with the token
  const baseUrl = window.location.origin;
  return `${baseUrl}/disc-assessment/${token}`;
}
