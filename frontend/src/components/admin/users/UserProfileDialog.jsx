import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Eye,
  IndianRupee,
  Mail,
  RotateCcw,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/common/StatCard";
import BorrowingHistoryCard from "./BorrowingHistoryCard";
import { formatDateTime, getPaginationRange } from "@/constants/Helper";
import axios from "axios";
import Loader from "@/components/common/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UserProfileDialog = ({ userData }) => {
  const [profileStats, setProfileStats] = useState(null);
  const [borrowRecord, setBorrowRecord] = useState([]);
  const [loading, setLoading] = useState({
    fetchBorrowRecordLoading: false,
    userStats: false,
  });
  const [pagination, setPagination] = useState({
    totalRecord: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 6,
  });
  const fetchProfileStat = async () => {
    setLoading((prev) => ({ ...prev, userStats: true }));

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/stats?id=${userData?._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        setProfileStats(response.data.data);
      }
    } catch (error) {
      console.error(
        "Error fetching profile stats:",
        error.response?.data || error.message
      );
    } finally {
      setLoading((prev) => ({ ...prev, userStats: false }));
    }
  };

  const fetchBorrowRecord = async (page = 1) => {
    setLoading((prev) => ({ ...prev, fetchBorrowRecordLoading: true }));
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/borrow/history?&page=${page}&limit=${pagination.pageSize}&userId=${
          userData?._id
        }`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        setBorrowRecord(response?.data?.data);

        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
          currentPage: page,
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading((prev) => ({ ...prev, fetchBorrowRecordLoading: false }));
    }
  };

  useEffect(() => {
    fetchProfileStat();
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => fetchBorrowRecord(1)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
        >
          <Eye className="w-5 h-5" /> View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[95vw] sm:!w-[90vw] !h-[95vh] !max-w-none sm:!max-w-5xl p-4 sm:p-6 sm:rounded-lg rounded-none overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
          <DialogDescription>
            Displays detailed information about the selected user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {/* Profile Information */}
          <div className="p-4 border rounded-2xl bg-zinc-900">
            <div className="flex gap-3 items-center justify-center sm:justify-start">
              <User strokeWidth={3} />
              <span className="text-2xl font-bold">Profile Information</span>
            </div>

            {/* User Details */}
            <div className="flex mt-4 flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 sm:h-20 sm:w-20 shadow-md">
                  <AvatarImage
                    src={userData?.profilePic?.imageUrl}
                    alt={userData?.fullName}
                  />
                  <AvatarFallback>
                    {userData?.fullName
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-xl leading-tight capitalize">
                    {userData?.fullName}
                  </p>
                  <p className="text-customGray text-sm flex items-center gap-1 mt-1">
                    <Mail size={15} className="text-customblue" />
                    {userData?.email}
                  </p>
                  <p className="text-customGray text-sm flex items-center gap-1 mt-1">
                    <CalendarDays size={15} className="text-customblue" />
                    {formatDateTime(userData?.createdAt).date}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge
                  className={`font-bold ${
                    userData?.isBlocked ? "bg-red-600" : "bg-green-600"
                  } text-white text-xs px-3 py-1 rounded-md`}
                >
                  {userData?.isBlocked ? "Blocked" : "Active"}
                </Badge>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 rounded-2xl border">
            <StatCard
              icon={BookOpen}
              title="Issued"
              value={loading.userStats ? null : profileStats?.issuedBooksCount}
              color="blue"
            />
            <StatCard
              icon={RotateCcw}
              title="Returned"
              value={
                loading.userStats ? null : profileStats?.returnedBooksCount
              }
              color="green"
            />
            <StatCard
              icon={AlertTriangle}
              title="Overdue"
              value={loading.userStats ? null : profileStats?.overdueBooksCount}
              color="orange"
            />
            <StatCard
              icon={IndianRupee}
              title="Total Fines"
              value={loading.userStats ? null : profileStats?.totalFines}
              color="red"
            />
          </div>
          {/* Borrowing History */}
          {loading.fetchBorrowRecordLoading ? (
            <div className="flex justify-center my-10">
              {" "}
              <Loader width={9} height={40} />
            </div>
          ) : (
            <div className="p-4 border rounded-2xl grid grid-cols-1 gap-4 md:grid-cols-3">
              {borrowRecord.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground text-lg py-10 border border-dashed rounded-xl">
                  📚 No borrowing history found.
                </p>
              ) : (
                borrowRecord.map((record) => (
                  <BorrowingHistoryCard key={record._id} recordData={record} />
                ))
              )}
            </div>
          )}
          {/* Pagination */}
          {pagination.totalRecord > pagination.pageSize && (
            <div className="flex justify-center items-center mt-6">
              <Pagination>
                <PaginationContent>
                  {/* Previous */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.currentPage > 1) {
                          fetchBorrowRecord(pagination.currentPage - 1);
                        }
                      }}
                      className={
                        pagination.currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* Pages */}
                  {getPaginationRange(
                    pagination.currentPage,
                    pagination.totalPages
                  ).map((page, idx) => (
                    <PaginationItem key={idx}>
                      {page === "start-ellipsis" || page === "end-ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => fetchBorrowRecord(page)}
                          isActive={pagination.currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (pagination.currentPage < pagination.totalPages) {
                          fetchBorrowRecord(pagination.currentPage + 1);
                        }
                      }}
                      className={
                        pagination.currentPage === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
