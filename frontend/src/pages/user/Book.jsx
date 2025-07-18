import React, { useEffect, useState } from "react";
import { starGenerator } from "@/constants/Helper";
import {
  CheckCircle,
  Clock,
  Delete,
  MessageSquare,
  Plus,
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { formatDateTime } from "@/constants/Helper";

const Book = () => {
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState({
    fetchBookLoading: false,
    writeReviewLoading: false,
  });
  const [book, setBook] = useState(null);
  const { bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading((prev) => ({ ...prev, fetchBookLoading: true }));
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/${bookId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setBook(response?.data?.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading((prev) => ({ ...prev, fetchBookLoading: false }));
      }
    };
    fetchBook();
  }, [bookId]);

  const availabilityStatus =
    book?.availableQuantity > 0 ? "Available" : "Not Available";

  const handleWriteReview = () => {
    setIsEditModelOpen(true);
  };

  const handleValueChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.comment.trim() === "") {
      toast.error("Review Cannot be empty");
      return;
    }
    setLoading((prev) => ({ ...prev, writeReviewLoading: true }));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/review/createReview/${bookId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        book?.reviews?.unshift(response?.data?.data);
        setIsEditModelOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, writeReviewLoading: false }));
    }
  };

  return loading.fetchBookLoading ? (
    <div className="flex justify-center my-10">
      {" "}
      <Loader width={9} height={40} />
    </div>
  ) : (
    <div className="w-full px-4 py-6 bg-gray-50 dark:bg-transparent">
      {/* BookDetails */}
      <div className="p-4 mb-6 sm:py-6 rounded-2xl dark:bg-zinc-900 bg-white shadow-md flex flex-col sm:flex-row gap-8">
        {/* Image */}
        <div className="w-full sm:w-[40%] max-h-[30rem] rounded-2xl overflow-hidden flex justify-center items-center">
          <img
            src={book?.coverImage?.imageUrl}
            alt={book?.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Title & Author */}
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white capitalize">
              {book?.title}
            </h1>
            {book?.authors?.map((author, idx) => (
              <span
                key={idx}
                className="text-lg text-zinc-600 dark:text-zinc-400"
              >
                {author}
                {idx < book?.authors?.length - 1 && ","}
              </span>
            ))}

            <p className="text-sm text-zinc-500 mt-1 dark:text-zinc-400 capitalize">
              Language: <span className="font-medium">{book?.language}</span>
            </p>
          </div>

          {/* Description */}
          <div className="text-zinc-700 dark:text-zinc-300">
            <p>{book?.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">{starGenerator(book?.rating)}</div>
            <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
              {book?.rating?.toFixed(1)}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {book?.genres.map((genre) => (
              <span
                key={genre}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium px-3 py-1 rounded-full text-sm capitalize"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Availability */}
          {!book?.isDeleted && (
            <Alert
              className={`border-l-4 ${
                availabilityStatus === "Available"
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-red-500 bg-red-50 dark:bg-red-950"
              }`}
            >
              <CheckCircle
                className={`h-4 w-4 ${
                  availabilityStatus === "Available"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              />
              <AlertDescription className="font-medium text-zinc-800 dark:text-zinc-200">
                {availabilityStatus} • {book?.availableQuantity} of{" "}
                {book?.quantity} copies available
              </AlertDescription>
            </Alert>
          )}

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {book?.keywords.map((word) => (
              <span
                key={word}
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium px-3 py-1 rounded-full text-xs capitalize"
              >
                {word}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <div className="w-full">
            {book?.isDeleted ? (
              <div className="flex items-center gap-2 text-customGray">
                <Clock className="w-8 h-8" />
                <span className="font-bold text-3xl">Coming Soon</span>
              </div>
            ) : book?.availableQuantity > 0 ? (
              <Button className="text-center w-full font-bold">
                Request Book
              </Button>
            ) : (
              <Button className="text-center w-full font-bold">
                Join Queue
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Review */}
      <div className="p-4 sm:py-6 rounded-2xl dark:bg-zinc-900 bg-white shadow-md">
        {/* reviews header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-customGray" />
            <span className="text-customYellow text-2xl font-bold">
              Reviews
            </span>
          </div>
          <Button onClick={handleWriteReview}>
            <Plus />
            Write Review
          </Button>
        </div>
        {/* Write Review */}
        <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
          <DialogContent className="sm-max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-bold">Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts about this book with other users.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-3 py-4">
                <div className="grid gap-4 items-center">
                  <Label htmlFor="rating" className="font-bold">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    max="5"
                    min="1"
                    value={formData.rating}
                    onChange={handleValueChange}
                  />
                </div>

                <div className="grid gap-3 items-center">
                  <Label htmlFor="comment" className="font-bold">
                    Your Review
                  </Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleValueChange}
                    type="text"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {loading.writeReviewLoading ? <Loader /> : "Submit Review"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Review Container */}
        <div className="w-full flex flex-col gap-3 mt-5 overflow-y-auto max-h-[60vw] scrollbar-thin  sm:px-2">
          {book?.reviews?.length > 0 ? (
            book?.reviews?.map((review) => (
              <Card
                key={review?._id}
                className="border-l-4 border-l-blue-500 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-200"
              >
                {console.log(review)}
                <CardContent className="pt-5 pb-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarImage
                        src={review?.user?.profilePic?.imageUrl}
                        alt={review?.user?.fullName}
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Header: Name + Rating + Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-bold text-base capitalize">
                            {review?.user?.fullName}
                          </h4>
                          <span className="text-sm text-customGray font-bold">
                            {formatDateTime(review?.createdAt).date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
                          <div className="flex items-center">
                            {starGenerator(review?.rating)}
                          </div>
                          <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                            {review?.rating}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {review?.comment}
                      </p>

                      {/* Action */}
                      <div className="mt-3">
                        <Button size="sm">
                          <Delete className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No reviews yet. Be the first to write one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
