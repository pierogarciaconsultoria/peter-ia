
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link?: string;
  type?: string;
  reference_id?: string;
}

/**
 * Creates a notification for a user
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "general",
  referenceId: string = "",
  link: string = ""
): Promise<{ success: boolean; error?: any }> {
  try {
    // Enhanced validation to prevent security issues
    if (!userId || !isValidUUID(userId)) {
      console.warn("Invalid user ID for notification:", userId);
      return { success: false, error: "Invalid user ID" };
    }

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      read: false,
      type,
      reference_id: referenceId,
      link,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error };
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!notificationId || !isValidUUID(notificationId)) {
      console.warn("Invalid notification ID:", notificationId);
      return { success: false, error: "Invalid notification ID" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error };
  }
}

/**
 * Marks all notifications of a user as read
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!userId || !isValidUUID(userId)) {
      console.warn("Invalid user ID for marking notifications:", userId);
      return { success: false, error: "Invalid user ID" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error };
  }
}

/**
 * Gets all notifications for a user
 */
export async function getNotifications(
  userId: string
): Promise<{ data: Notification[] | null; error?: any }> {
  try {
    if (!userId || !isValidUUID(userId)) {
      console.warn("Invalid user ID for fetching notifications:", userId);
      toast.error("Failed to load notifications");
      return { data: [], error: "Invalid user ID" };
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { data: null, error };
  }
}

/**
 * Validates if a string is a UUID
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
