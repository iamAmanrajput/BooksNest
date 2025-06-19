import StatCard from "@/components/common/StatCard";
import { AlertTriangle, BookOpen, IndianRupee, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "@/components/common/BookCard";

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
      <div className="w-full text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 mt-6 rounded-2xl h-[10rem] flex items-center hover:shadow-md duration-200">
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
        <h1 className="text-4xl font-bold text-center pt-6 pb-9">
          Featured Books
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 gap-3">
          {featuredBooks?.map((book) => (
            <BookCard key={book?._id} bookData={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
