import BookCard from "@/components/common/BookCard";
import Loader from "@/components/common/Loader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { BookX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { genreData } from "@/constants/Helper";
import { getPaginationRange } from "@/constants/Helper";

const AllBooks = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    totalBooks: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  // Fetch books from API
  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/book/books?genre=${genre}&language=${language}&availability=${availability}&search=${search}&page=${page}&limit=${
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
        setBooks(response?.data?.data);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
          currentPage: page,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  //  Fetch books — always start from page 1
  useEffect(() => {
    fetchBooks(1);
  }, [search, genre, language, availability]);

  const languageData = {
    trigger: "Language",
    items: ["English", "Hindi", "French", "Spanish", "German"],
  };

  const availabilityData = {
    trigger: "Availability",
    items: ["Available", "Unavailable"],
  };

  return (
    <div className="w-full px-4 py-6 text-zinc-900 dark:text-zinc-100 bg-gray-100 dark:bg-[#09090B]">
      {/* Heading and Filters Section */}
      <div className="w-full bg-gray-50 dark:bg-zinc-900 shadow-sm rounded-2xl px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-zinc-900 dark:text-zinc-100 text-3xl sm:text-5xl font-extrabold text-center">
          Discover Books
        </h1>

        {/* Filters & Search */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-[60%] gap-4">
            <Select onValueChange={(value) => setGenre(value)}>
              <SelectTrigger
                id={genreData.trigger}
                className="w-full sm:w-auto cursor-pointer"
              >
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genreData.items.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="capitalize cursor-pointer"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger
                id={languageData.trigger}
                className="w-full sm:w-auto cursor-pointer"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageData.items.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="capitalize cursor-pointer"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setAvailability(value)}>
              <SelectTrigger
                id={availabilityData.trigger}
                className="w-full sm:w-auto cursor-pointer"
              >
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityData.items.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="capitalize cursor-pointer"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-[35%]">
            <Input
              id="search"
              className="sm:px-6"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Book Cards */}
      {loading ? (
        <div className="flex justify-center mx-auto my-10">
          <Loader width={9} height={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-6">
          {books.length === 0 ? (
            <div className="col-span-full w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-md">
              <BookX className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-800 dark:text-zinc-100">
                No Books Found
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
                We couldn't find any books matching your search. <br />
                Try adjusting your filters or searching with different keywords.
              </p>
            </div>
          ) : (
            books?.map((book) => <BookCard key={book?._id} bookData={book} />)
          )}
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex justify-center items-center">
        {pagination.totalBooks > pagination.pageSize && (
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination.currentPage > 1) {
                      fetchBooks(pagination.currentPage - 1); //  go to previous page
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
                      onClick={() => fetchBooks(page)} // fetch selected page
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
                      fetchBooks(pagination.currentPage + 1); //  go to next page
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

export default AllBooks;
