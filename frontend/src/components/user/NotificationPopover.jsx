import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlarmClock,
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  IndianRupee,
  MailOpen,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { formatDateTime } from "@/constants/Helper";
import Loader from "../common/Loader";

const NotificationPopOver = () => {
  const [isNotificationModelOpen, setIsNotificationModelOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState({
    fechNotificationLoading: false,
    clearNotificationLoading: false,
  });
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotificationCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/notification/count`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setUnreadNotificationCount(response?.data?.data);
        }
      } catch (error) {
        console.log(error?.response?.data?.message || "Internal Server Error");
        toast.error(error?.response?.data?.message || "Internal Server Error");
      }
    };
    fetchUnreadNotificationCount();
  }, []);

  const notificationMeta = [
    {
      type: "due_reminder",
      icon: AlarmClock,
      color: "text-red-500",
    },
    {
      type: "queue_notification",
      icon: MailOpen,
      color: "text-blue-500",
    },
    {
      type: "fine_alert",
      icon: IndianRupee,
      color: "text-yellow-500",
    },
    {
      type: "book_available",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      type: "queue_reminder",
      icon: CalendarClock,
      color: "text-purple-500",
    },
    {
      type: "request_approved",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      type: "request_rejected",
      icon: XCircle,
      color: "text-rose-500",
    },
    {
      type: "overdue_alert",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
  ];

  const handleFetchNotifications = async () => {
    setLoading((prev) => ({ ...prev, fechNotificationLoading: true }));
    setUnreadNotificationCount(0);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notification/notifications`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setNotifications(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, fechNotificationLoading: false }));
    }
  };

  const handleClearNotifications = async () => {
    setLoading((prev) => ({ ...prev, clearNotificationLoading: true }));
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/notification/clear`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setNotifications([]);
        toast.success(
          response?.data?.message || "Notifications cleared successfully"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, clearNotificationLoading: false }));
    }
  };

  return (
    <Popover
      open={isNotificationModelOpen}
      onOpenChange={setIsNotificationModelOpen}
    >
      <PopoverTrigger asChild className="cursor-pointer">
        <Button
          onClick={handleFetchNotifications}
          variant="outline"
          className="relative"
          size="icon"
        >
          <Bell className="size-4 text-zinc-600 dark:text-zinc-300 cursor-pointer" />
          {unreadNotificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 animate-pulse flex items-center justify-center p-0 text-xs"
            >
              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className=" w-80 sm:w-100 mr-4 sm:mr-8">
        <div className="border-b pb-4">
          <h3 className="font-semibold text-center text-xl">Notifications</h3>
        </div>
        {loading.fechNotificationLoading ? (
          <div className="flex justify-center my-10">
            {" "}
            <Loader width={6} height={30} />
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-100">
            {notifications?.map((notification) => {
              const meta = notificationMeta.find(
                (item) => item.type === notification?.type
              );
              return (
                <div
                  key={notification._id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 transition-all cursor-pointer border border-muted/30 
  hover:shadow-lg hover:-translate-y-0.5 hover:border-muted 
  duration-200 ease-in-out my-4"
                >
                  {/* Blue Dot */}
                  {!notification?.isRead && (
                    <span className="mt-2 h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}

                  {/* Icon */}
                  <div className="text-xl mt-1 flex-shrink-0">
                    {" "}
                    {meta?.icon && (
                      <meta.icon className={`w-6 h-6 ${meta.color}`} />
                    )}
                  </div>

                  {/* Title / Message + Date */}
                  <div className="flex flex-col text-xs font-medium text-foreground leading-relaxed">
                    <p>
                      <span className="font-bold">{notification?.title}</span> —{" "}
                      {notification?.message}
                    </p>

                    {/* Date & Time */}
                    <div className="flex gap-3 items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(notification?.createdAt).date}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(notification?.createdAt).time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        )}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClearNotifications}
            disabled={loading.clearNotificationLoading}
            size="sm"
            className="w-full text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            {loading.clearNotificationLoading ? (
              <Loader />
            ) : (
              <>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all notifications
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopOver;
