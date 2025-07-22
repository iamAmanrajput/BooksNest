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
import { UserX } from "lucide-react";
import { useSelector } from "react-redux";
import UserCard from "./UserCard";

const UsersPage = ({ fetchUsersData }) => {
  const { users, loading, pagination } = useSelector((state) => state.users);

  return (
    <>
      {loading.fetchUsersLoading ? (
        <div className="flex justify-center mx-auto my-10">
          <Loader width={9} height={40} />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border border-dashed border-gray-300 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
          <UserX className="w-12 h-12 mb-4 text-gray-400" />
          <h2 className="text-lg font-semibold">No Users Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters to see results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map((user) => (
            <UserCard key={user._id} userData={user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalUsers > pagination.pageSize && (
        <div className="flex justify-center items-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination.currentPage > 1) {
                      fetchUsersData(pagination.currentPage - 1);
                    }
                  }}
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {getPaginationRange(
                pagination.currentPage,
                pagination.totalPages
              ).map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "start-ellipsis" || page === "end-ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => fetchUsersData(page)}
                      isActive={pagination.currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (pagination.currentPage < pagination.totalPages) {
                      fetchUsersData(pagination.currentPage + 1);
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
    </>
  );
};

export default UsersPage;
