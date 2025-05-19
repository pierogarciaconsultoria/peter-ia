
import { createNotification } from "@/services/notificationService";

/**
 * Helper function with explicit types to safely create notifications
 * TEMPORARY DISABLED
 */
export const safeCreateNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType: "task" | "other", 
  entityId: string,
  link?: string
): Promise<void> => {
  console.log("Função safeCreateNotification desabilitada temporariamente", {
    userId, title, message, entityType, entityId, link
  });
  // Não faz nada, função desabilitada temporariamente
};
