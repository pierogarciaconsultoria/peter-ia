
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

// This is a temporary workaround until we add a notifications table to the database
export async function createNotification(
  user_id: string,
  title: string,
  message: string,
  type: string,
  link: string | null = null,
  entity_id: string | null = null
): Promise<Notification> {
  console.log("Creating notification:", { user_id, title, message, type, link, entity_id });
  
  // Return mocked notification object for now
  return {
    id: `notification-${Date.now()}`,
    user_id,
    title,
    message,
    created_at: new Date().toISOString(),
    read: false,
    read_at: null,
    type,
    link,
    entity_id
  };
  
  // Uncomment once notifications table is created in the database
  /*
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
  */
}

export async function getUserNotifications(user_id: string): Promise<Notification[]> {
  console.log("Getting notifications for user:", user_id);
  
  // Return mocked notifications for now
  return []; // Empty array as placeholder
  
  // Uncomment once notifications table is created in the database
  /*
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
  */
}

export async function markNotificationAsRead(id: string): Promise<void> {
  console.log("Marking notification as read:", id);
  
  // Do nothing for now, just a placeholder
  return;
  
  // Uncomment once notifications table is created in the database
  /*
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
  */
}

export async function markAllNotificationsAsRead(user_id: string): Promise<void> {
  console.log("Marking all notifications as read for user:", user_id);
  
  // Do nothing for now, just a placeholder
  return;
  
  // Uncomment once notifications table is created in the database
  /*
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
  */
}

export async function deleteNotification(id: string): Promise<void> {
  console.log("Deleting notification:", id);
  
  // Do nothing for now, just a placeholder
  return;
  
  // Uncomment once notifications table is created in the database
  /*
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting notification:", error);
    throw new Error(error.message);
  }
  */
}
