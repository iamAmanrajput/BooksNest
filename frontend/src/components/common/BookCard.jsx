import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Clock, Star, Languages, Boxes, BookCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { starGenerator } from "@/constants/Helper";

const BookCard = ({ bookData }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/book/${bookData?._id}`)}
      className={`
        relative group w-full p-0 rounded-3xl border-0
        overflow-hidden cursor-pointer transform-gpu transition-all 
        hover:scale-[1.015] duration-300 
        h-full flex flex-col
      `}
    >
      {/* Cover Image Section */}
      <div className="relative">
        <img
          src={bookData?.coverImage?.imageUrl}
          alt={bookData?.title}
          className="object-cover w-full h-60"
        />
        {/* Dark overlay only in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 to-transparent dark:opacity-80 opacity-0" />
        {/* Genres as floating badges on image */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {bookData?.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="backdrop-blur bg-gray-100 text-zinc-900 px-2 py-1 rounded-xl text-xs shadow dark:bg-zinc-800/60 dark:border-zinc-600 dark:text-zinc-200 "
            >
              {genre}
            </span>
          ))}
          {bookData?.genres?.length > 2 && (
            <span className="backdrop-blur bg-gray-100 text-zinc-900 px-2 py-1 rounded-xl text-xs shadow dark:bg-zinc-800/60 dark:border-zinc-600 dark:text-zinc-200 ">
              +{bookData.genres.length - 2}
            </span>
          )}
        </div>
      </div>

      <CardHeader className="pb-0 pt-5 px-5">
        <CardTitle
          className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-2"
          title={bookData?.title}
        >
          {bookData?.title?.split(" ").length > 7
            ? bookData?.title?.split(" ").slice(0, 7).join(" ") + "..."
            : bookData?.title}
        </CardTitle>
        <div className="flex flex-wrap gap-x-2 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {bookData?.authors?.map((author, idx) => (
            <span key={idx}>
              {author}
              {idx < bookData.authors.length - 1 && ","}
            </span>
          ))}
        </div>
      </CardHeader>

      {/* Main Card Content */}
      <CardContent className="flex-1 flex flex-col justify-between px-5 pt-3 pb-2 gap-2">
        {/* Description */}
        <p className="text-zinc-700 dark:text-zinc-300 text-base font-medium line-clamp-2 italic">
          {bookData?.description?.split(" ").slice(0, 18).join(" ") +
            (bookData?.description?.split(" ").length > 18 ? "..." : "")}
        </p>
        {/* Language */}
        <div className="flex items-center gap-2 mt-1 text-zinc-500 dark:text-zinc-400">
          {bookData?.language && (
            <>
              <Languages className="w-4 h-4" />
              <span className="text-xs uppercase">{bookData?.language}</span>
            </>
          )}
        </div>

        {/* RATING */}
        <div className="flex flex-col items-start gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="flex">{starGenerator(bookData?.rating)}</div>
            <span className="text-customGray font-bold text-xl">
              {bookData?.rating?.toFixed(1)}
            </span>
          </div>

          {!bookData?.isDeleted && (
            <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-200 text-sm mt-1">
              <BookCheck className="w-4 h-4 text-customGray" />
              <span className="font-semibold text-customGray">Available:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 ">
                {bookData?.availableQuantity}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-start gap-2 p-4 dark:bg-zinc-900">
        {bookData?.isDeleted ? (
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-200">
            <Clock className="w-5 h-5" />
            <span className="font-semibold text-sm">Coming Soon</span>
          </div>
        ) : (
          <Button variant="default" size="sm" className="w-full font-bold">
            Explore
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
