import StatCard from "@/components/common/StatCard";
import { AlertTriangle, BookOpen, IndianRupee, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "@/components/common/BookCard";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [profileStats, setProfileStats] = useState({});
  const [loading, setLoading] = useState({
    featuredBooks: false,
    userStats: false,
  });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfileStat = async () => {
      setLoading((prev) => ({ ...prev, userStats: true }));

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("No access token found. Skipping profile stats fetch.");
        setLoading((prev) => ({ ...prev, userStats: false }));
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile/stats`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.success) {
          setProfileStats(response.data.data);
        }
      } catch (error) {
        console.error(
          "Error fetching profile stats:",
          error.response?.data || error.message
        );
      } finally {
        setLoading((prev) => ({ ...prev, userStats: false }));
      }
    };

    const fetchFeaturedBooks = async () => {
      setLoading((prev) => ({ ...prev, featuredBooks: true }));

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/featuredBook`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log(response);
        setFeaturedBooks(response?.data.data);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading((prev) => ({ ...prev, featuredBooks: false }));
      }
    };

    fetchProfileStat();
    fetchFeaturedBooks();
  }, []);

  return (
    <div className="px-4 flex flex-col gap-6 bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      {/* Welcome Banner */}
      <div className="w-full bg-white dark:bg-zinc-900 mt-6 rounded-2xl h-[10rem] flex items-center hover:shadow-md transition duration-200">
        <div className="flex flex-col gap-3 px-10">
          <h1 className="text-3xl font-bold capitalize">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Discover new books and manage your reading journey.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Issued"
          value={
            loading.userStats === true ? null : profileStats?.issuedBooksCount
          }
          color="blue"
        />
        <StatCard
          icon={RotateCcw}
          title="Returned"
          value={
            loading.userStats === true ? null : profileStats?.returnedBooksCount
          }
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={
            loading.userStats === true ? null : profileStats?.overdueBooksCount
          }
          color="orange"
        />
        <StatCard
          icon={IndianRupee}
          title="Total Fines"
          value={loading.userStats === true ? null : profileStats?.totalFines}
          color="red"
        />
      </div>

      {/* Featured Books */}
      <div className="w-full mb-6 rounded-2xl">
        <h1 className="text-4xl font-bold text-center pt-6 pb-9">
          Featured Books
        </h1>
        {loading.featuredBooks === true ? (
          <div className="flex justify-center my-10">
            {" "}
            <Loader width={9} height={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {featuredBooks?.map((book) => (
              <BookCard key={book?._id} bookData={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
