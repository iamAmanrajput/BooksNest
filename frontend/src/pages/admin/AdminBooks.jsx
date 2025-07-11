import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { starGenerator } from "@/constants/Helper";
import axios from "axios";
import {
  BookCheck,
  BookX,
  Languages,
  Pencil,
  Plus,
  Send,
  Trash2,
  User2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { genreData } from "@/constants/Helper";
import { getPaginationRange } from "@/constants/Helper";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { languageData } from "@/constants/Helper";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import IssueBookDialog from "@/components/admin/Books/IssueBookDialog";

const AdminBooks = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState({
    fetchBookLoading: false,
    createBookLoading: false,
  });
  const [isBookAddModelOpen, setIsBookAddModelOpen] = useState(false);
  const [pagination, setPagination] = useState({
    totalBooks: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [authors, setAuthors] = useState([""]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 0,
    language: "",
  });
  const [error, setError] = useState("");

  // Authors
  const handleAuthorChange = (index, value) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const handleAuthorAdd = () => {
    setAuthors([...authors, ""]);
  };

  const handleAuthorRemove = (index) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);
  };

  // Keywords
  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleKeywordAdd = () => {
    setKeywords([...keywords, ""]);
  };

  const handleKeywordRemove = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
  };

  // handle genres change
  const handleGenreChange = (value) => {
    if (!genres.includes(value)) {
      setGenres([...genres, value]);
    }
    setSelectedGenre("");
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenres(genres.filter((g) => g !== genreToRemove));
  };

  // set coverImage & preview
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  // clear coverImage Preview
  const handleClearPreview = () => {
    setCoverImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const availabilityData = {
    trigger: "Availability",
    items: ["Available", "Unavailable"],
  };

  // create book
  const handleCreateBook = async (e) => {
    e.preventDefault();
    setError("");
    setLoading((prev) => ({ ...prev, createBookLoading: true }));

    let { title, description, quantity, language } = formData;

    // Filter empty strings
    const filteredKeywords = keywords.filter(
      (keyword) => keyword.trim() !== ""
    );
    const filteredAuthors = authors.filter((author) => author.trim() !== "");

    // Validation checks
    if (!title.trim()) {
      setError("Title is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (!language.trim()) {
      setError("Language is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (!selectedFile) {
      setError("Cover image is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (filteredKeywords.length === 0) {
      setError("At least one keyword is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (filteredAuthors.length === 0) {
      setError("At least one author is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    if (genres.length === 0) {
      setError("At least one genre is required");
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
      return;
    }

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("quantity", quantity);
      form.append("language", language);
      form.append("image", selectedFile);

      filteredAuthors.forEach((author) => form.append("authors", author));
      genres.forEach((genre) => form.append("genres", genre));
      filteredKeywords.forEach((keyword) => form.append("keywords", keyword));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/book/createBook`,
        form,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "Book created successfully");
        setBooks([response.data.data, ...books]);
        setFormData({
          title: "",
          description: "",
          quantity: 0,
          language: "",
        });
        setAuthors([""]);
        setKeywords([""]);
        setGenres([]);
        setSelectedFile(null);
        setCoverImagePreview("");
        setIsBookAddModelOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, createBookLoading: false }));
    }
  };

  // update availableQuantity after issue book
  const updateAvailableQuantity = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book._id === id
          ? {
              ...book,
              availableQuantity:
                book.availableQuantity > 0
                  ? book.availableQuantity - 1
                  : book.availableQuantity,
            }
          : book
      )
    );
  };

  // Fetch books from API
  const fetchBooks = async (page = 1) => {
    setLoading((prev) => ({ ...prev, fetchBookLoading: true }));
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
      setLoading((prev) => ({ ...prev, fetchBookLoading: false }));
    }
  };

  //  Fetch books — always start from page 1
  useEffect(() => {
    fetchBooks(1);
  }, [search, genre, language, availability]);

  return (
    <div className="w-full px-4 py-6 text-zinc-900 dark:text-zinc-100 bg-gray-100 dark:bg-[#09090B]">
      {/* Heading and Search Filter */}
      <div className="w-full bg-gray-50 dark:bg-zinc-900 shadow-sm rounded-2xl px-6 py-8 max-w-7xl mx-auto">
        {/* Header*/}
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between">
          <div>
            <h1 className="text-zinc-900 dark:text-zinc-100 text-3xl font-extrabold">
              Books Management
            </h1>
            <p className="text-customGray text-sm mt-1 font-bold">
              Manage your library's book collection
            </p>
          </div>
          <div>
            <Button
              onClick={(e) => setIsBookAddModelOpen(true)}
              className="font-semibold"
            >
              <Plus />
              Add New Book
            </Button>
          </div>
        </div>
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
      {/* Books */}
      {loading.fetchBookLoading ? (
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
            books?.map((book) => (
              <Card
                key={book?._id}
                className="pt-0 flex flex-col justify-between h-full"
              >
                <img
                  src={book?.coverImage?.imageUrl}
                  alt={book?.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div>
                  <CardHeader className="space-y-1 ">
                    <CardTitle className="text-lg font-semibold">
                      {book?.title?.split(" ").length > 5
                        ? book?.title?.split(" ").slice(0, 5).join(" ") + "..."
                        : book?.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground font-medium">
                      <User2 className="h-4 w-4" />
                      {book?.authors?.map((author, idx) => (
                        <span key={idx}>
                          {author}
                          {idx < book.authors.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                    <CardDescription className="text-sm text-customGray line-clamp-2">
                      {book?.description?.split(" ").slice(0, 16).join(" ") +
                        (book?.description?.split(" ").length > 16
                          ? "..."
                          : "")}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 mt-2">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">{starGenerator(book?.rating)}</div>
                      <span className="text-customGray font-bold text-sm">
                        {book?.rating?.toFixed(1)}
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookCheck className="h-4 w-4" />
                      <span>
                        {book?.availableQuantity} / {book?.quantity} available
                      </span>
                    </div>

                    {/* Language */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Languages className="h-4 w-4" />
                      {book?.language}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {book?.genres?.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                      {book?.genres?.length > 2 && (
                        <Badge>+{book.genres.length - 2}</Badge>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex justify-between gap-2">
                  <Button className="flex-1" variant="outline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {/* issue Book Dialog */}
                  <IssueBookDialog
                    onQuantityUpdate={updateAvailableQuantity}
                    bookDetails={book}
                  />
                  <Button className="flex-1" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
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

      {/* Add Book Dialog */}
      <Dialog open={isBookAddModelOpen} onOpenChange={setIsBookAddModelOpen}>
        <DialogContent className="!w-[95vw] sm:!w-[90vw] !h-[95vh] !max-w-none sm:!max-w-5xl p-4 sm:p-6 sm:rounded-lg rounded-none">
          <div className="text-2xl mb-3">Add New Book</div>

          <ScrollArea className="w-full h-[75vh] px-1 sm:px-2">
            <form
              onSubmit={handleCreateBook}
              className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {/* title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  value={formData.title}
                  placeholder="Enter title"
                />
              </div>

              {/* quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="font-bold">
                  Quantity
                </Label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  placeholder="Enter book quantity"
                />
              </div>

              {/* language select */}
              <div className="space-y-2">
                <Label htmlFor={languageData.trigger}>Language</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: value,
                    }))
                  }
                >
                  <SelectTrigger
                    id={languageData.trigger}
                    className="w-full cursor-pointer"
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
              </div>

              {/* description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">
                  Description
                </Label>
                <Textarea
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  id="description"
                  name="description"
                  placeholder="Enter book description..."
                />
              </div>

              {/* cover image */}
              <div className="space-y-2">
                <Label htmlFor="image">Cover Image</Label>
                <Input
                  onChange={handleCoverImageChange}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  id="image"
                />

                {coverImagePreview && (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <img
                      src={coverImagePreview}
                      className="w-full h-full object-cover rounded-md"
                      alt="uploaded cover"
                    />
                    <X
                      onClick={handleClearPreview}
                      className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 z-20 text-customGray bg-white dark:bg-zinc-900 rounded-full p-1 shadow-md cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Authors */}
              <div className="space-y-2">
                <Label>Authors</Label>
                {authors.map((author, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      type="text"
                      placeholder={`Author ${index + 1}`}
                      value={author}
                      onChange={(e) =>
                        handleAuthorChange(index, e.target.value)
                      }
                    />
                    {authors.length > 1 && (
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleAuthorRemove(index)}
                      >
                        ❌
                      </Button>
                    )}
                  </div>
                ))}
                <Button size="sm" type="button" onClick={handleAuthorAdd}>
                  ➕ Add Author
                </Button>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label>Keywords</Label>
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      type="text"
                      placeholder={`Keyword ${index + 1}`}
                      value={keyword}
                      onChange={(e) =>
                        handleKeywordChange(index, e.target.value)
                      }
                    />
                    {keywords.length > 1 && (
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleKeywordRemove(index)}
                      >
                        ❌
                      </Button>
                    )}
                  </div>
                ))}
                <Button size="sm" type="button" onClick={handleKeywordAdd}>
                  ➕ Add Keyword
                </Button>
              </div>

              {/* Genres */}
              <div className="space-y-2">
                <Label>Genres</Label>

                {genres.length !== 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => handleRemoveGenre(genre)}
                          className="ml-1 rounded-full hover:bg-gray-300 p-1"
                        >
                          <X size={12} className="text-muted-foreground" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <Select value={selectedGenre} onValueChange={handleGenreChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{genreData.trigger}</SelectLabel>
                      {genreData.items
                        .filter((item) => !genres.includes(item))
                        .map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </form>
            {error && (
              <div className="mt-2 w-full text-center rounded-md bg-red-800/20 text-sm text-red-400 shadow-sm sm:text-base px-4 py-2 ">
                {error}
              </div>
            )}
            <Button
              disabled={loading.createBookLoading}
              onClick={handleCreateBook}
              className="w-full mt-4"
            >
              {loading.createBookLoading ? <Loader /> : "Create Book"}
            </Button>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooks;
