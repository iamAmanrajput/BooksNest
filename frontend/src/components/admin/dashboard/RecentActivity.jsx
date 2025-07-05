import Loader from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/constants/Helper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RecentActivity = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Custom function to get badge styles based on status
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

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/recent-activities`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setActivityData(response.data.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-customGray">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-5">
        {loading ? (
          <Loader height={30} width={8} />
        ) : activityData?.length === 0 ? (
          <p className="text-center text-sm text-customGray py-6">
            No recent activity found.
          </p>
        ) : (
          activityData?.map((activity) => (
            <div
              key={activity?._id}
              className="w-full flex items-center justify-between"
            >
              <div className="flex gap-3 items-center">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                  <AvatarImage src={activity?.userId?.profilePic?.imageUrl} />
                  <AvatarFallback>
                    {activity?.userId?.fullName
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium leading-none truncate">
                    {activity?.userId?.fullName}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 truncate  text-customGray ">
                    {activity?.bookId?.title?.length > 27
                      ? activity.bookId.title.slice(0, 27) + "..."
                      : activity.bookId.title}
                  </p>
                </div>
              </div>
              <div>
                <Badge className={`${getBadgeClass(activity?.status)} text-xs`}>
                  {activity?.status.replace("_", " ")}
                </Badge>
                <p className="text-xs mt-1 text-customGray hidden sm:block">
                  {formatDateTime(activity?.updatedAt).date}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
