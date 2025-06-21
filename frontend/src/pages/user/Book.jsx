import React, { useState } from "react";
import { starGenerator } from "@/constants/Helper";
import { CheckCircle, Delete, MessageSquare, Plus, User } from "lucide-react";
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

const Book = () => {
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const availabilityStatus = "Available";
  const availableCopies = 3;
  const totalCopies = 5;

  const genres = ["Fiction", "Classic", "Romance", "Drama"];
  const keywords = ["1920s", "American Dream", "Wealth", "Love"];
  const language = "English";

  const handleWriteReview = () => {
    setIsEditModelOpen(true);
  };

  const handleValueChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full px-4 py-6 bg-gray-50 dark:bg-transparent">
      {/* BookDetails */}
      <div className="p-4 mb-6 sm:py-6 rounded-2xl dark:bg-zinc-900 bg-white shadow-md flex flex-col sm:flex-row gap-8">
        {/* Image */}
        <div className="w-full sm:w-[40%] max-h-[30rem] rounded-2xl overflow-hidden flex justify-center items-center">
          <img
            src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Book Cover"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Title & Author */}
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              The Great Gatsby
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              by F. Scott Fitzgerald
            </p>
            <p className="text-sm text-zinc-500 mt-1 dark:text-zinc-400">
              Language: <span className="font-medium">{language}</span>
            </p>
          </div>

          {/* Description */}
          <div className="text-zinc-700 dark:text-zinc-300">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Laboriosam architecto, explicabo quia pariatur ad earum est odio
              error debitis, modi culpa. Veritatis, praesentium? Vel laborum,
              animi unde soluta ea perspiciatis.
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">{starGenerator(3.5)}</div>
            <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
              3.5
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium px-3 py-1 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Availability */}
          <Alert
            className={`border-l-4 ${
              availabilityStatus === "Available"
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}
          >
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="font-medium text-zinc-800 dark:text-zinc-200">
              {availabilityStatus} • {availableCopies} of {totalCopies} copies
              available
            </AlertDescription>
          </Alert>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {keywords.map((word) => (
              <span
                key={word}
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium px-3 py-1 rounded-full text-xs"
              >
                {word}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <div className="w-full">
            <Button className="text-center w-full">Request For Borrow</Button>
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
            <form>
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
                <Button type="submit">Submit Review</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Review Container */}
        <div className="w-full flex flex-col gap-3 mt-5 overflow-y-auto max-h-[60vw] scrollbar-thin  sm:px-2">
          <Card className="border-l-4 border-l-blue-500 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-200">
            <CardContent className="pt-5 pb-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage
                    src={
                      "https://imgs.search.brave.com/xO8lz1rNAk4OfCLKqi10VIk6rA-0gATgJ55aD5Cc3gc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/MDk1LzQ3NS9zbWFs/bC9haS1nZW5lcmF0/ZWQtYS1oYXBweS1z/bWlsaW5nLXByb2Zl/c3Npb25hbC1tYW4t/bGlnaHQtYmx1cnJ5/LW9mZmljZS1iYWNr/Z3JvdW5kLWNsb3Nl/dXAtdmlldy1waG90/by5qcGc" ||
                      "/placeholder.svg"
                    }
                    alt="Aman Singh"
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
                        Aman Singh
                      </h4>
                      <span className="text-sm text-customGray font-bold">
                        1/1/2025
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
                      <div className="flex items-center">
                        {starGenerator(4)}
                      </div>
                      <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                        3.5
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    lorem10sbgvdvdgydgvbuegenivv Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit.
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
        </div>
      </div>
    </div>
  );
};

export default Book;
