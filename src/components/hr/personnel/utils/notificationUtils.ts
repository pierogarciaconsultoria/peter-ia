
import { createNotification } from "@/services/notificationService";

/**
 * Helper function with explicit types to safely create notifications
 */
export const safeCreateNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType: "task" | "other", 
  entityId: string,
  link?: string
): Promise<void> => {
  try {
    // Extra validation of user ID
    if (!userId || typeof userId !== 'string' || userId.length < 10) {
      console.warn('Invalid user ID for notification:', userId);
      return;
    }
    
    const result = await createNotification(userId, title, message, entityType, entityId, link);
    if (!result.success) {
      console.error('Failed to create notification:', result.error);
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
