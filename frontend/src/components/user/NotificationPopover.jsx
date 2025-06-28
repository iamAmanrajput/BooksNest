import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

const NotificationPopOver = () => {
  const [isNotificationModelOpen, setIsNotificationModelOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  return (
    <Popover
      open={isNotificationModelOpen}
      onOpenChange={setIsNotificationModelOpen}
    >
      <PopoverTrigger asChild className="cursor-pointer">
        <Button variant="outline" className="relative" size="icon">
          <Bell className="size-4 text-zinc-600 dark:text-zinc-300 cursor-pointer" />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {/* {unreadCount > 9 ? "9+" : unreadCount} */} 9+
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className=" w-80 sm:w-100 mr-4 sm:mr-8">
        <div className="border-b pb-4">
          <h3 className="font-semibold text-center text-xl">Notifications</h3>
        </div>
        {/* {notifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : ( */}
        <ScrollArea className="h-100">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 transition-all cursor-pointer border border-muted/30 
             hover:shadow-lg hover:-translate-y-0.5 hover:border-muted 
             duration-200 ease-in-out my-4"
              onClick={() => console.log("Marked as read")}
            >
              {/* Icon */}
              <div className="text-xl mt-1 transition-transform duration-200 group-hover:scale-110">
                📚
              </div>

              {/* Title / Message */}
              <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-4">
                Book Available — Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Aspernatur dolores libero provident commodi
                itaque molestiae, rerum dolorem eum veritatis neque consequuntur
                necessitatibus eligendi nisi ipsa quidem possimus, fugit labore?
              </p>
            </div>
          ))}
        </ScrollArea>

        {/* )} */}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopOver;
