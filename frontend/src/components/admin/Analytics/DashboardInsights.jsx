import React, { useEffect, useState } from "react";
import TopBorrowedBooks from "./TopBorrowedBooks";
import RecentActivity from "./RecentActivity";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";

const DashboardInsights = () => {
  const [loading, setLoading] = useState({
    topBorrowedBooksLoading: false,
    recentActivityLoading: false,
  });
  const [topBorrowedBooks, setTopBorrowedBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchTopBorrowedBooks = async () => {
    setLoading((prev) => ({ ...prev, topBorrowedBooksLoading: true }));
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/analytics/top-borrowed-books`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setTopBorrowedBooks(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, topBorrowedBooksLoading: false }));
    }
  };
  const fetchRecentActivity = async () => {
    setLoading((prev) => ({ ...prev, recentActivityLoading: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/analytics/recent-activity`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setRecentActivity(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, recentActivityLoading: false }));
    }
  };
  useEffect(() => {
    fetchTopBorrowedBooks();
    fetchRecentActivity();
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {loading.topBorrowedBooksLoading ? (
        <div className="flex justify-center my-8">
          {" "}
          <Loader width={9} height={40} />
        </div>
      ) : topBorrowedBooks.length === 0 ? (
        <Card className="flex justify-center items-center">
          <p className="text-muted-foreground text-sm">
            No top borrowed books found.
          </p>
        </Card>
      ) : (
        <TopBorrowedBooks topBorrowedBooksData={topBorrowedBooks} />
      )}

      {loading.recentActivityLoading ? (
        <div className="flex justify-center my-8">
          {" "}
          <Loader width={9} height={40} />
        </div>
      ) : recentActivity.length === 0 ? (
        <Card className="flex justify-center items-center">
          <p className="text-muted-foreground text-sm">
            No recent user activity found.
          </p>
        </Card>
      ) : (
        <RecentActivity recentActivityData={recentActivity} />
      )}
    </div>
  );
};

export default DashboardInsights;
