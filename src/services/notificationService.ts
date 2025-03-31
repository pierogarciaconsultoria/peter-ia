
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  read_at: string | null;
  type: string;
  link: string | null;
  entity_id: string | null;
}

export async function createNotification(
  user_id: string,
  title: string,
  message: string,
  type: string,
  link: string | null = null,
  entity_id: string | null = null
): Promise<Notification> {
  const notification = {
    user_id,
    title,
    message,
    type,
    link,
    entity_id,
    read: false
  };

  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getUserNotifications(user_id: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ 
      read: true,
      read_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw new Error(error.message);
  }
}

export async function markAllNotificationsAsRead(user_id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ 
      read: true,
      read_at: new Date().toISOString()
    })
    .eq('user_id', user_id)
    .eq('read', false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error(error.message);
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting notification:", error);
    throw new Error(error.message);
  }
}
