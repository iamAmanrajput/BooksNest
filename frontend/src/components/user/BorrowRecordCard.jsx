import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  Undo2,
  CheckCircle,
  User,
  Hourglass,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "../common/Loader";

const BorrowRecordCard = ({
  _id,
  title,
  author,
  status, // "pending" | "issued" | "returned" | "return_requested" | "rejected" | "queued" | "overdue"
  issueDate,
  coverImage,
  dueDate,
  returnDate,
  fine,
  isRenewed,
  queuePosition,
  onRenew,
  onReturn,
  renewBookLoading,
  returnBookLoading,
}) => {
  const renderBadge = () => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "issued":
        return <Badge variant="primary">Issued</Badge>;
      case "returned":
        return <Badge>Returned</Badge>;
      case "return_requested":
        return <Badge variant="outline">Return Requested</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "queued":
        return <Badge variant="secondary">Queued</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {/* Book Title + Author + Avatar */}
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src={coverImage} alt={title} />
              <AvatarFallback>{title?.[0] || "B"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight mb-1">
                {title?.split(" ").length > 3
                  ? title?.split(" ").slice(0, 3).join(" ") + " ..."
                  : title}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <User className="h-4 w-4 mr-1" />
                {author}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isRenewed ? (
            <div className="flex items-center gap-2">
              <Badge variant="primary">Renewed</Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">{renderBadge()}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Dates */}
        {!["pending", "queued", "rejected"].includes(status) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* issued date */}
            {["issued", "returned", "return_requested", "overdue"].includes(
              status
            ) && (
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Issued: </span>
                  <span className="font-medium">{issueDate}</span>
                </div>
              </div>
            )}

            {/* due date */}
            {["issued", "returned", "return_requested", "overdue"].includes(
              status
            ) && (
              <div className="flex items-center justify-self-end text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Due: </span>
                  <span
                    className={`font-medium ${
                      status === "overdue"
                        ? "text-red-600 dark:text-red-400"
                        : ""
                    }`}
                  >
                    {dueDate}
                  </span>
                </div>
              </div>
            )}

            {/* returned date */}
            {status === "returned" && returnDate && (
              <div className="flex items-center text-sm">
                <Undo2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Returned: </span>
                  <span className="font-medium">{returnDate}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show Some Text */}
        {["pending", "return_requested"].includes(status) && (
          <p
            className={`text-sm text-customGray flex items-center justify-center ${
              status === "pending" ? "mt-2" : "mt-10"
            }`}
          >
            <Hourglass className="h-6 w-6 mr-2 text-yellow-600" />
            {status === "pending"
              ? "Please wait for admin approval."
              : "Your return request is under review."}
          </p>
        )}

        {/* Request Rejected text */}
        {status === "rejected" && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center mt-2">
            <XCircle className="h-5 w-5 mr-2" />
            Your request has been rejected by the admin.
          </p>
        )}

        {/* Fine */}
        {(status === "returned" || status === "overdue") && fine > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Fine Amount:
              </span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                ₹{fine}
              </span>
            </div>
          </div>
        )}

        {/* Queue position */}
        {status === "queued" && (
          <div className="mb-4 text-sm text-muted-foreground">
            Your queue position:{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {queuePosition ?? "N/A"}
            </span>
          </div>
        )}

        {/* Actions */}
        {(status === "issued" || status === "overdue") && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {status === "overdue" && (
              <Button
                onClick={() => onRenew(_id)}
                variant="outline"
                className="w-full sm:w-auto sm:flex-1"
                disabled={renewBookLoading}
              >
                {renewBookLoading ? (
                  <Loader />
                ) : (
                  <>
                    <Undo2 className="h-4 w-4 mr" />
                    Renew Book{" "}
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={() => onReturn(_id)}
              className="w-full sm:w-auto sm:flex-1"
              disabled={returnBookLoading}
            >
              {returnBookLoading ? (
                <Loader />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Return Book
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BorrowRecordCard;
