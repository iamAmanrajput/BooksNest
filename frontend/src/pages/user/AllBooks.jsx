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

const AllBooks = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const genreData = {
    trigger: "Genre",
    items: [
      // Fiction
      "Fantasy",
      "Science Fiction",
      "Mystery",
      "Thriller",
      "Horror",
      "Romance",
      "Historical Fiction",
      "Adventure",
      "Drama",
      "Dystopian",
      "Young Adult",
      "Children",
      "Graphic Novel",
      "Mythology",
      "Satire",
      "Short Stories",

      // Non-Fiction
      "Biography",
      "Autobiography",
      "Memoir",
      "History",
      "Science",
      "Self-Help",
      "Psychology",
      "Philosophy",
      "Religion",
      "Politics",
      "Business",
      "Economics",
      "Technology",
      "Education",
      "Travel",
      "Health",
      "Art",
      "Photography",
      "Law",
      "Cooking",
      "Parenting",
      "Language",

      // Academic
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "Engineering",
      "Medical",
      "Environmental Studies",
      "Sociology",
      "Anthropology",
      "Literature",
      "Statistics",
      "Civics",
      "Geography",
      "Accountancy",
      "Commerce",
    ],
  };

  const languageData = {
    trigger: "Language",
    items: ["English", "Hindi", "French", "Spanish", "German"],
  };

  const availabilityData = {
    trigger: "Availability",
    items: ["Available", "Unavailable"],
  };

  useEffect(() => {
    const getFilteredBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/book/books?genre=${genre}&language=${language}&availability=${availability}&search=${search}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log(response);
        if (response?.data?.success) {
          setBooks(response?.data?.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    getFilteredBooks();
  }, [search, genre, language, availability]);

  return (
    <div className="w-full px-4 py-6 text-zinc-900 dark:text-zinc-100 bg-gray-100 dark:bg-[#09090B]">
      {/* heading & Input Div */}
      <div className="w-full bg-gray-50 dark:bg-zinc-900 shadow-sm rounded-2xl px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-zinc-900 dark:text-zinc-100 text-3xl sm:text-5xl font-extrabold text-center">
          Discover Books
        </h1>

        {/* Input & Dropdown Section */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Dropdown Filters */}
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
      {/* Card container */}
      {loading ? (
        <div className="flex justify-center mx-auto my-10">
          {" "}
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
    </div>
  );
};

export default AllBooks;
