import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { languageData } from "@/constants/Helper";
import { genreData } from "@/constants/Helper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, X } from "lucide-react";
import Loader from "@/components/common/Loader";
import axios from "axios";
import { toast } from "sonner";

const EditBookDialog = ({ bookDetails, onUpdateBookData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: bookDetails?.title,
    description: bookDetails?.description,
    quantity: bookDetails?.quantity,
    language: bookDetails?.language,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [authors, setAuthors] = useState(bookDetails?.authors);
  const [genres, setGenres] = useState(bookDetails?.genres);
  const [keywords, setKeywords] = useState(bookDetails?.keywords);
  const [error, setError] = useState("");
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const fileInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let { title, description, quantity, language } = formData;

    // Filter empty strings
    const filteredKeywords = keywords.filter(
      (keyword) => keyword.trim() !== ""
    );
    const filteredAuthors = authors.filter((author) => author.trim() !== "");

    // Validation checks
    if (!title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }

    if (!language.trim()) {
      setError("Language is required");
      setLoading(false);
      return;
    }
    if (filteredKeywords.length === 0) {
      setError("At least one keyword is required");
      setLoading(false);
      return;
    }

    if (filteredAuthors.length === 0) {
      setError("At least one author is required");
      setLoading(false);
      return;
    }

    if (genres.length === 0) {
      setError("At least one genre is required");
      setLoading(false);
      return;
    }
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("quantity", quantity);
    form.append("language", language);
    form.append("bookId", bookDetails?._id);
    if (selectedFile) {
      form.append("image", selectedFile);
    }
    filteredAuthors.forEach((author) => form.append("authors", author));
    genres.forEach((genre) => form.append("genres", genre));
    filteredKeywords.forEach((keyword) => form.append("keywords", keyword));
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/book/update`,
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
        toast.success(response.data.message || "Book updated successfully");
        onUpdateBookData(bookDetails?._id, response.data.data);
        setSelectedFile(null);
        setCoverImagePreview("");
        setIsEditModelOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1" variant="outline">
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[95vw] sm:!w-[90vw] !h-[95vh] !max-w-none sm:!max-w-5xl p-4 sm:p-6 sm:rounded-lg rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Book</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-[75vh] px-1 sm:px-2">
          <form
            onSubmit={handleSubmit}
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
                value={formData.language}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, language: value }))
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
                    onChange={(e) => handleAuthorChange(index, e.target.value)}
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
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
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
            disabled={loading}
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-4"
          >
            {loading ? <Loader /> : "Edit Book"}
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookDialog;
