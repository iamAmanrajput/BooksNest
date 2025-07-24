import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RecentActivity = ({ recentActivityData }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "issued":
        return "bg-blue-100 text-blue-800";
      case "returned":
        return "bg-green-100 text-green-800";
      case "return_requested":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "queued":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest library transactions and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivityData.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              {/* User Avatar */}
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={activity?.user?.profilePic?.imageUrl}
                  alt={activity?.user?.fullName}
                  className="object-cover"
                />
                <AvatarFallback>
                  {activity?.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">
                    {activity?.user?.fullName}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {activity?.timeAgo}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{activity?.status}:</span>{" "}
                  {activity?.book?.title?.split(" ").slice(0, 4).join(" ") +
                    (activity?.book?.title?.split(" ").length > 4
                      ? " ..."
                      : "")}
                </p>
              </div>

              {/* Action Type Badge */}
              <div className="flex-shrink-0">
                <Badge className={`${getBadgeClass(activity?.status)} text-xs`}>
                  {activity?.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
