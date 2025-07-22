import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/constants/Helper";

// Status badge color map
const statusColorMap = {
  pending: "bg-yellow-100 text-yellow-800",
  issued: "bg-blue-100 text-blue-800",
  returned: "bg-green-100 text-green-700",
  return_requested: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-700",
  queued: "bg-gray-100 text-gray-800",
  overdue: "bg-orange-100 text-orange-800",
};

const BorrowingHistoryCard = ({ recordData }) => {
  const status = recordData?.status;
  const badgeClass =
    "px-2 py-0.5 rounded-full text-xs font-semibold " +
    (statusColorMap[status] || "bg-gray-200 text-gray-700");

  const showDates = status === "issued" || status === "returned";
  const now = new Date();
  const isOverdue =
    status === "issued" &&
    recordData?.dueDate &&
    new Date(recordData.dueDate) < now;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">
          {recordData?.bookId?.title.split(" ").length > 5
            ? recordData?.bookId?.title.split(" ").slice(0, 5).join(" ") + "..."
            : recordData?.bookId?.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {/* Status */}
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className={badgeClass}>{status}</span>
          </div>

          {/* Overdue badge for issued */}
          {isOverdue && (
            <div className="flex justify-end">
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                Overdue
              </span>
            </div>
          )}

          {/* Dates for issued or returned */}
          {showDates && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Issue Date:</span>
                <span className="font-medium">
                  {recordData?.issueDate
                    ? formatDateTime(recordData.issueDate).date
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium">
                  {recordData?.dueDate
                    ? formatDateTime(recordData.dueDate).date
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Return Date:</span>
                <span className="font-medium">
                  {recordData?.returnDate
                    ? formatDateTime(recordData.returnDate).date
                    : "—"}
                </span>
              </div>
            </>
          )}

          {/* Queue Position */}
          {status === "queued" && (
            <div className="flex justify-between">
              <span className="text-gray-500">Queue Position:</span>
              <span className="font-medium">
                {recordData?.queuePosition ?? "—"}
              </span>
            </div>
          )}

          {/* Rejected message */}
          {status === "rejected" && (
            <div className="text-red-600 font-medium">
              Your request is rejected.
            </div>
          )}

          {/* Pending message */}
          {status === "pending" && (
            <div className="text-yellow-700 font-medium">
              Your request is pending.
            </div>
          )}

          {/* Return Requested message */}
          {status === "return_requested" && (
            <div className="text-purple-800 font-medium">
              You have requested to return this book.
            </div>
          )}

          {/* Fine > 0 */}
          {recordData?.fine > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Fine:</span>
              <span className="text-red-600 font-bold">₹{recordData.fine}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BorrowingHistoryCard;
