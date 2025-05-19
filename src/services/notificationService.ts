
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
 * TEMPORARY DISABLED
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "general",
  referenceId: string = "",
  link: string = ""
): Promise<{ success: boolean; error?: any }> {
  console.log("Notificação desabilitada temporariamente:", { userId, title, message });
  // Retorna sucesso sem realmente criar a notificação
  return { success: true };
}

/**
 * Marks a notification as read
 * TEMPORARY DISABLED
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: any }> {
  console.log("Marcação de notificação como lida desabilitada temporariamente:", notificationId);
  // Retorna sucesso sem realmente marcar como lida
  return { success: true };
}

/**
 * Marks all notifications of a user as read
 * TEMPORARY DISABLED
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error?: any }> {
  console.log("Marcação de todas notificações como lidas desabilitada temporariamente:", userId);
  // Retorna sucesso sem realmente marcar como lidas
  return { success: true };
}

/**
 * Gets all notifications for a user
 * TEMPORARY DISABLED
 */
export async function getNotifications(
  userId: string
): Promise<{ data: Notification[] | null; error?: any }> {
  console.log("Busca de notificações desabilitada temporariamente:", userId);
  // Retorna array vazio de notificações
  return { data: [] };
}

/**
 * Validates if a string is a UUID
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
