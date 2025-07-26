import Loader from "@/components/common/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BorrowRecordCard from "@/components/user/BorrowRecordCard";
import { formatDateTime } from "@/constants/Helper";
import axios from "axios";
import { FileQuestion } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPaginationRange } from "@/constants/Helper";

const MyHistory = () => {
  const [borrowRecord, setBorrowRecord] = useState([]);
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState({
    fetchBorrowRecordLoading: false,
    renewBookLoading: false,
    returnBookLoading: false,
  });

  const [pagination, setPagination] = useState({
    totalRecord: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  // Fetch records based on page and status
  const fetchBorrowRecord = async (page = 1) => {
    setLoading((prev) => ({ ...prev, fetchBorrowRecordLoading: true }));
    const statusToSend = status === "all" ? "" : status;

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/borrow/history?status=${statusToSend}&page=${page}&limit=${
          pagination.pageSize
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
    fetchBorrowRecord(1);
  }, [status]);

  // Handle return request
  const handleReturn = async (id) => {
    setLoading((prev) => ({ ...prev, returnBookLoading: true }));

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/borrow/send/returnRequest/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Return request sent");
        setBorrowRecord((prev) =>
          prev.map((record) =>
            record._id === id
              ? { ...record, status: "return_requested" }
              : record
          )
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Internal Server Error, Please try Again"
      );
    } finally {
      setLoading((prev) => ({ ...prev, returnBookLoading: false }));
    }
  };

  // Handle renew request
  const handleRenew = async (id) => {
    setLoading((prev) => ({ ...prev, renewBookLoading: true }));

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/borrow/send/renewRequest/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Renew request sent");
        fetchBorrowRecord(pagination.currentPage); // Refresh current page
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Internal Server Error, Please try Again"
      );
    } finally {
      setLoading((prev) => ({ ...prev, renewBookLoading: false }));
    }
  };

  return (
    <div className="w-full px-4 py-6 text-zinc-900 dark:text-zinc-100 bg-gray-100 dark:bg-[#09090B]">
      {/* Header and Filter */}
      <div className="w-full bg-gray-50 dark:bg-zinc-900 shadow-sm rounded-2xl px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-center">
          My History
        </h1>
        <p className="text-customGray text-xs font-bold text-center pt-2">
          Track your book transactions and manage returns
        </p>

        {/* Status Filter */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-8">
          <div className="w-full sm:w-1/2">
            <h1 className="text-xl font-bold">Status Filter</h1>
            <p className="text-sm font-semibold text-muted-foreground pt-1">
              Select a status to view relevant entries
            </p>
          </div>

          <div className="w-full sm:pt-1 sm:w-1/2">
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger
                id="status-filter"
                className="w-full cursor-pointer"
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "all",
                  "pending",
                  "issued",
                  "returned",
                  "return_requested",
                  "rejected",
                  "queued",
                ].map((stat) => (
                  <SelectItem
                    key={stat}
                    value={stat}
                    className="capitalize cursor-pointer"
                  >
                    {stat.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content: Borrow Records */}
      {loading.fetchBorrowRecordLoading ? (
        <div className="flex justify-center mx-auto my-10">
          <Loader width={9} height={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 mt-6 mb-6">
          {borrowRecord?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-md">
              <FileQuestion className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-semibold">
                No Records Available
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
                You currently have no history in this status. Try changing the
                filter above.
              </p>
            </div>
          ) : (
            borrowRecord.map((record) => (
              <BorrowRecordCard
                key={record._id}
                _id={record._id}
                title={record?.bookId?.title}
                coverImage={record?.bookId?.coverImage?.imageUrl}
                author={record?.bookId?.authors?.[0] || "Unknown"}
                isRenewed={
                  record?.renewCount >= 1 && record?.status !== "returned"
                }
                status={record.status}
                issueDate={
                  record.issueDate ? formatDateTime(record.issueDate).date : ""
                }
                returnDate={
                  record.returnDate
                    ? formatDateTime(record.returnDate).date
                    : ""
                }
                dueDate={
                  record.dueDate ? formatDateTime(record.dueDate).date : ""
                }
                fine={record.fine}
                queuePosition={record.queuePosition || null}
                onRenew={handleRenew}
                onReturn={handleReturn}
                renewBookLoading={loading.renewBookLoading}
                returnBookLoading={loading.returnBookLoading}
              />
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
  );
};

export default MyHistory;
