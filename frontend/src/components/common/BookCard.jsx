import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

const BookCard = ({ bookData }) => {
  return (
    <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-white-xl border-none rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300 bg-white dark:bg-zinc-900 cursor-pointer pt-0">
      <img
        src={bookData?.coverImage?.imageUrl}
        alt={bookData?.title}
        className="w-full h-48 object-cover"
      />

      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {bookData?.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {bookData?.authors?.map((author) => author)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Book Description */}
        <p className="text-zinc-700 dark:text-zinc-300 text-sm">
          {bookData?.description?.split(" ").slice(0, 16).join(" ") +
            (bookData?.description?.split(" ").length > 16 ? "..." : "")}
        </p>

        {/* Genres & Language */}
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
            <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3 py-1 rounded-full">
              +{bookData.genres.length - 2}
            </span>
          )}
        </div>
        {bookData?.language && (
          <span className="inline-block text-center bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3 py-1 rounded-full">
            {bookData.language}
          </span>
        )}
      </CardContent>

      <CardFooter className="flex w-full flex-wrap justify-between items-center gap-4">
        {/* Left - Explore Button */}
        <div className="order-1">
          <Button variant="default" className="rounded-full px-6">
            Explore Now
          </Button>
        </div>

        {/* Center - Rating */}
        <div className="order-2 flex items-center gap-1 text-yellow-500 mx-auto">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {bookData?.rating}
          </span>
        </div>

        {/* Right - Quantity */}
        <div className="order-3 text-sm text-zinc-700 dark:text-zinc-300 ml-auto">
          <span className="font-medium">Available:</span>{" "}
          {bookData?.availableQuantity}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
