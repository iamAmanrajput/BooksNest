import StatCard from "@/components/common/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, BookOpen, IndianRupee, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState({
    featuredBooks: false,
    userStats: false,
  });

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      setLoading((prev) => ({ ...prev, featuredBooks: true }));

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/featuredBook`,
          { withCredentials: true }
        );
        setFeaturedBooks(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading((prev) => ({ ...prev, featuredBooks: false }));
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div className="px-4 flex flex-col gap-6">
      {/* 1st box */}
      <div className="w-full text-zinc-900 dark:text-zinc-100 bg-gray-100 dark:bg-zinc-900 mt-6 rounded-2xl h-[10rem] flex items-center">
        <div className="flex flex-col gap-3 px-10">
          <h1 className="text-3xl font-bold">Welcome back, John Doe!</h1>
          <p>Discover new books and manage your reading journey.</p>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Active Borrowings"
          value={5}
          color="blue"
        />
        <StatCard
          icon={RotateCcw}
          title="Returned"
          value={5}
          color="green"
          lightColor="green"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={5}
          color="orange"
          lightColor="orange"
        />

        <StatCard
          icon={IndianRupee}
          title="Total Fines"
          value={5}
          color="red"
          lightColor="red"
        />
      </div>
      {/* Featured Book */}
      <div className="w-full  mb-6 rounded-2xl">
        <h1 className="text-3xl font-bold text-center pt-6 pb-9">
          Featured Books
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 gap-3">
          {featuredBooks?.map((book) => (
            <Card
              key={book?._id}
              className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-xl border-none rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-300 bg-white dark:bg-zinc-900 cursor-pointer pt-0"
            >
              <img
                src={book?.coverImage?.imageUrl}
                alt={book?.title}
                className="w-full h-48 object-cover"
              />

              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {book?.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {book?.authors?.map((author) => author)}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Book Description */}
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                  {book?.description?.split(" ").slice(0, 16).join(" ") +
                    (book?.description?.split(" ").length > 16 ? "..." : "")}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {book?.genres?.map((genre) => (
                    <span
                      key={genre}
                      className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap justify-between items-center gap-4 sm:gap-2">
                {/* Explore Button */}
                <Button variant="default" className="rounded-full px-6">
                  Explore Now
                </Button>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {book?.rating}
                  </span>
                </div>

                {/* Available Quantity */}
                <div className="text-sm text-zinc-700 dark:text-zinc-300 ml-auto">
                  <span className="font-medium">Available:</span>{" "}
                  {book?.availableQuantity}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
