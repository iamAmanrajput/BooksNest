import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ bookData }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/book/${bookData?._id}`)}
      className="w-full pt-0 max-w-sm md:max-w-md lg:max-w-lg shadow-white-xl border-none rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300 bg-white dark:bg-zinc-900 cursor-pointer flex flex-col h-full"
    >
      {/* Cover Image */}
      <img
        src={bookData?.coverImage?.imageUrl}
        alt={bookData?.title}
        className="w-full h-48 object-cover"
      />

      {/* Card Body */}
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-2">
          {/* Title with direct truncate logic */}
          <CardTitle className="text-lg font-semibold" title={bookData?.title}>
            {bookData?.title?.split(" ").length > 5
              ? bookData?.title?.split(" ").slice(0, 5).join(" ") + "..."
              : bookData?.title}
          </CardTitle>

          {/* Authors */}
          <div className="flex flex-wrap gap-x-1 text-sm text-muted-foreground">
            {bookData?.authors?.map((author, idx) => (
              <span key={idx}>
                {author}
                {idx < bookData.authors.length - 1 && ","}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 flex-1">
          {/* Description */}
          <p className="text-zinc-700 dark:text-zinc-300 text-sm">
            {bookData?.description?.split(" ").slice(0, 16).join(" ") +
              (bookData?.description?.split(" ").length > 16 ? "..." : "")}
          </p>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {bookData?.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3 py-1 rounded-full"
              >
                {genre}
              </span>
            ))}
            {bookData?.genres?.length > 2 && (
              <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-2 py-1 rounded-full">
                +{bookData.genres.length - 2}
              </span>
            )}
          </div>

          {/* Language */}
          {bookData?.language && (
            <span className="inline-block text-center bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3 py-1 mb-2 rounded-full">
              {bookData.language}
            </span>
          )}
        </CardContent>

        <CardFooter className="flex w-full flex-wrap justify-between items-center gap-3 mt-auto">
          {/* Explore Button */}
          {!bookData?.isDeleted && (
            <Button variant="default" className="rounded-full px-6 order-1">
              Explore Now
            </Button>
          )}

          {/* Rating */}
          <div className="order-2 flex items-center gap-1 text-yellow-500 mx-auto">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {bookData?.rating.toFixed(1)}
            </span>
          </div>

          {/* Quantity */}
          <div className="order-3 text-sm text-zinc-700 dark:text-zinc-300 ml-auto">
            {bookData?.isDeleted ? (
              <div className="flex items-center gap-2 text-customGray">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xl">Coming Soon</span>
              </div>
            ) : (
              <>
                {" "}
                <span className="font-medium">Available:</span>{" "}
                <span className="text-customYellow">
                  {bookData?.availableQuantity}
                </span>
              </>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BookCard;
