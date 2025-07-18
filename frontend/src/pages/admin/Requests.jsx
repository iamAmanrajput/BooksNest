import RequestStats from "@/components/admin/Request/RequestStats";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestCard from "@/components/admin/Request/RequestCard";
import { FileX } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
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
import { getPaginationRange } from "@/constants/Helper";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState({ fetchRecordsLoading: false });
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const fetchRecords = async (page = 1) => {
    setLoading((prev) => ({ ...prev, fetchRecordsLoading: true }));
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/borrow/requestData?email=${email}&status=${status}&page=${page}&limit=10`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setRequests(response.data.data);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
          currentPage: page,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, fetchRecordsLoading: false }));
    }
  };

  const deleteRequest = (requestId) => {
    setRequests((prev) => prev?.filter((doc) => doc._id !== requestId));
  };

  useEffect(() => {
    fetchRecords(1);
  }, [email, status]);

  return (
    <div className="px-4 pb-6 flex flex-col gap-6 bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      {/* Requests stats */}
      <RequestStats />

      {/* Input & Filter */}
      <div className="bg-white shadow-xs dark:bg-zinc-900 rounded-2xl p-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Input
            placeholder="Search user by email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full sm:w-1/2">
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="return_requested">Return Requested</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading.fetchRecordsLoading ? (
        <div className="flex justify-center mx-auto my-10">
          <Loader width={9} height={40} />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border border-dashed border-gray-300 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
          <FileX className="w-12 h-12 mb-4 text-gray-400" />
          <h2 className="text-lg font-semibold">No Requests Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            You're all caught up! It seems you've already cleared all{" "}
            {status === "pending" ? "Pending" : "Return Requested"} requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request?._id}
              requestData={request}
              deleteRequestFunction={deleteRequest}
            />
          ))}
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex justify-center items-center">
        {pagination.totalRecords > pagination.pageSize && (
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination.currentPage > 1) {
                      fetchRecords(pagination.currentPage - 1); //  go to previous page
                    }
                  }}
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {/* Smart Page Numbers with Ellipsis */}
              {getPaginationRange(
                pagination.currentPage,
                pagination.totalPages
              ).map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "start-ellipsis" || page === "end-ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => fetchRecords(page)} // fetch selected page
                      isActive={pagination.currentPage === page}
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
                    if (pagination.currentPage < pagination.totalPages) {
                      fetchRecords(pagination.currentPage + 1); //  go to next page
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
        )}
      </div>
    </div>
  );
};

export default Requests;
