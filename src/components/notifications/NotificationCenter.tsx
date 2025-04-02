
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, using a static user ID
      // In a real app, this would come from your auth context/session
      const currentUserId = "current-user-id";
      const { data, error } = await getNotifications(currentUserId);
      if (error) throw error;
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { success, error } = await markNotificationAsRead(notificationId);
      if (error) throw error;
      
      if (success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // For demo purposes, using a static user ID
      const currentUserId = "current-user-id";
      const { success, error } = await markAllNotificationsAsRead(currentUserId);
      if (error) throw error;
      
      if (success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notifications as read",
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-gray-500">No notifications</span>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="cursor-pointer">
                  <div 
                    className={`w-full p-2 ${!notification.read ? "bg-muted/50" : ""}`}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{notification.title}</span>
                      {!notification.read && (
                        <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                      {notification.link && (
                        <a 
                          href={notification.link} 
                          className="text-xs text-blue-500 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
