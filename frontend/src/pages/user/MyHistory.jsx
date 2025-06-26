import Loader from "@/components/common/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
        setPagination(response?.data?.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading((prev) => ({ ...prev, fetchBorrowRecordLoading: false }));
    }
  };

  useEffect(() => {
    fetchBorrowRecord(1);
  }, [status]);

  // get pagination range for pagination
  const getPaginationRange = (currentPage, totalPages) => {
    const range = [];

    // Always show first page
    if (currentPage > 2) {
      range.push(1);
      if (currentPage > 3) range.push("start-ellipsis");
    }

    // Always show current page
    if (currentPage > 1) range.push(currentPage - 1);
    range.push(currentPage);
    if (currentPage < totalPages) range.push(currentPage + 1);

    // Always show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) range.push("end-ellipsis");
      range.push(totalPages);
    }

    return range;
  };

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
        toast.success(
          response?.data?.message || "Return request sent to admin"
        );
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

  const handleRenew = async (id) => {
    setLoading((prev) => ({ ...prev, renewBookLoading: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/borrow/send/renewRequest/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message || "Renew request sent to admin");
        fetchBorrowRecord(pagination.currentPage);
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
      {/* Heading and Filters Section */}
      <div className="w-full bg-gray-50 dark:bg-zinc-900 shadow-sm rounded-2xl px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-zinc-900 dark:text-zinc-100 text-3xl sm:text-5xl font-extrabold text-center">
          My History
        </h1>
        <p className="text-customGray text-xs font-bold text-center pt-2">
          Track your book transactions and manage returns
        </p>

        {/* Filters & Search */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-8">
          {/* title container for filter */}
          <div className="w-full sm:w-1/2">
            <h1 className="text-xl font-bold">Status Filter</h1>
            <p className="text-sm font-semibold text-muted-foreground pt-1">
              Select a status to view relevant entries
            </p>
          </div>

          {/* filter container */}
          <div className="w-full sm:pt-1 sm:w-1/2">
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger
                id="status-filter"
                className="w-full cursor-pointer"
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="capitalize cursor-pointer" value="all">
                  All
                </SelectItem>
                <SelectItem
                  value="pending"
                  className="capitalize cursor-pointer"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="issued"
                  className="capitalize cursor-pointer"
                >
                  Issued
                </SelectItem>
                <SelectItem
                  value="returned"
                  className="capitalize cursor-pointer"
                >
                  Returned
                </SelectItem>
                <SelectItem
                  value="return_requested"
                  className="capitalize cursor-pointer"
                >
                  Return Requested
                </SelectItem>
                <SelectItem
                  value="rejected"
                  className="capitalize cursor-pointer"
                >
                  Rejected
                </SelectItem>
                <SelectItem
                  value="queued"
                  className="capitalize cursor-pointer"
                >
                  Queued
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* BorrowRecord Cards Container */}
      {loading.fetchBorrowRecordLoading ? (
        <div className="flex justify-center mx-auto my-10">
          <Loader width={9} height={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 mb-6">
          {borrowRecord?.length === 0 ? (
            <div className="col-span-full w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-md">
              <FileQuestion className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-800 dark:text-zinc-100">
                No Records Available
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
                You currently have no history in this status. <br />
                Try changing the status filter above to view other records.
              </p>
            </div>
          ) : (
            borrowRecord?.map((record) => (
              <BorrowRecordCard
                key={record?._id}
                _id={record?._id}
                title={record?.bookId?.title}
                coverImage={record?.bookId?.coverImage?.imageUrl}
                author={record?.bookId?.authors[0] || "Unknown"}
                status={record?.status}
                issueDate={
                  record?.issueDate
                    ? formatDateTime(record?.issueDate).date
                    : ""
                }
                returnDate={
                  record?.returnDate
                    ? formatDateTime(record?.returnDate).date
                    : ""
                }
                dueDate={
                  record?.dueDate ? formatDateTime(record?.dueDate).date : ""
                }
                fineAmount={record?.fineAmount}
                queuePosition={
                  record?.queuePosition ? record?.queuePosition : null
                }
                onRenew={handleRenew}
                renewBookLoading={loading.renewBookLoading}
                returnBookLoading={loading.returnBookLoading}
                onReturn={handleReturn}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex justify-center items-center">
        {pagination?.totalRecord > pagination?.pageSize && (
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination?.currentPage > 1) {
                      fetchBorrowRecord(pagination?.currentPage - 1); //  go to previous page
                    }
                  }}
                  className={
                    pagination?.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {/* Smart Page Numbers with Ellipsis */}
              {getPaginationRange(
                pagination?.currentPage,
                pagination?.totalPages
              ).map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "start-ellipsis" || page === "end-ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => fetchBorrowRecord(page)} // fetch selected page
                      isActive={pagination?.currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (pagination?.currentPage < pagination?.totalPages) {
                      fetchBorrowRecord(pagination?.currentPage + 1); //  go to next page
                    }
                  }}
                  className={
                    pagination?.currentPage === pagination?.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default MyHistory;
