import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/constants/Helper";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";

const RequestCard = ({ requestData, deleteRequestFunction }) => {
  const [loading, setLoading] = useState({
    approveRequestLoading: false,
    rejectRequestLoading: false,
  });

  const handleApproveRequest = async (requestId, actionData) => {
    if (actionData === "rejected") {
      setLoading((prev) => ({ ...prev, rejectRequestLoading: true }));
    } else {
      setLoading((prev) => ({ ...prev, approveRequestLoading: true }));
    }
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/borrow/handle/borrowRequest`,
        { action: actionData, requestId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        if (actionData === "rejected") {
          toast.success(
            response.data.message || "Book request rejected successfully"
          );
        } else {
          toast.success(
            response.data.message || "Book request accepted successfully"
          );
        }
        deleteRequestFunction(requestId);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      if (actionData === "rejected") {
        setLoading((prev) => ({ ...prev, rejectRequestLoading: false }));
      } else {
        setLoading((prev) => ({ ...prev, approveRequestLoading: false }));
      }
    }
  };

  const handleReturnRequest = async (requestId) => {
    setLoading((prev) => ({ ...prev, approveRequestLoading: true }));
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/borrow/handle/returnRequest`,
        { requestId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        toast.success(
          response.data.message || "Book request accepted successfully"
        );
        deleteRequestFunction(requestId);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading((prev) => ({ ...prev, approveRequestLoading: false }));
    }
  };

  const handleApproveClick = () => {
    const id = requestData?._id;
    const status = requestData?.status;

    if (!id) return;

    if (status === "pending") {
      handleApproveRequest(id, "issued");
    } else {
      handleReturnRequest(id);
    }
  };

  return (
    <Card className="flex flex-col h-full justify-between">
      {/* Header */}
      <CardHeader className="flex items-center gap-3">
        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
          <AvatarImage src={requestData?.profilePic?.imageUrl} />
          <AvatarFallback>
            {requestData?.fullName
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">{requestData?.fullName}</p>
          <p className="text-customGray text-sm">{requestData?.email}</p>
        </div>
      </CardHeader>

      {/* Main Content */}
      <CardContent className="flex flex-col gap-5 flex-grow">
        {/* Book Detail */}
        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
          <p className="text-sm text-customGray font-bold">Requested Book:</p>
          <p className="font-bold text-zinc-900 dark:text-zinc-100">
            {requestData?.title?.split(" ").slice(0, 8).join(" ") +
              (requestData?.title?.split(" ").length > 8 ? "..." : "")}
          </p>
        </div>

        {/* Date details */}
        {requestData?.status !== "pending" && (
          <div className="flex justify-between gap-2 sm:gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Issue Date:</span>
              <div className="font-medium">
                {formatDateTime(requestData?.issueDate).date}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <div className="font-medium">
                {formatDateTime(requestData?.dueDate).date}
              </div>
            </div>
          </div>
        )}

        {/* Fine Info */}
        {requestData?.overdueDays && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-sm">Overdue Fine</span>
            </div>
            <div className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-300">
              {requestData?.overdueDays} days overdue • ₹5 per day
            </div>
            <div className="text-base sm:text-lg font-bold text-red-700 dark:text-red-400">
              Total Fine: ₹{requestData?.calculatedFine}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-row items-center justify-between text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-0">
          {requestData?.renewCount > 0 && (
            <div>Total Renewals: {requestData?.renewCount}</div>
          )}

          <div>Requested: {formatDateTime(requestData?.updatedAt).date}</div>
        </div>
      </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="flex gap-2">
        <Button
          onClick={handleApproveClick}
          className="flex items-center gap-2 flex-1"
          disabled={loading.approveRequestLoading}
        >
          {loading.approveRequestLoading ? (
            <Loader />
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Approve
            </>
          )}
        </Button>
        {requestData.status === "pending" && (
          <Button
            onClick={() => handleApproveRequest(requestData?._id, "rejected")}
            className="flex items-center gap-2 flex-1"
            variant="destructive"
            disabled={loading.rejectRequestLoading}
          >
            {loading.rejectRequestLoading ? (
              <Loader />
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Reject
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RequestCard;
