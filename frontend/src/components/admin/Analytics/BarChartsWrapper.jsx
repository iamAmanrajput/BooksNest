import React, { useEffect, useState } from "react";
import MonthlyUsersChart from "./MonthlyUsersChart";
import IssuedBooksChart from "./IssuedBooksChart";
import axios from "axios";
import Loader from "@/components/common/Loader";

const BarChartsWrapper = () => {
  const [loading, setLoading] = useState({
    issuedBookLoading: false,
    usersLoading: false,
  });
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const fetchIssuedBooks = async () => {
    setLoading((prev) => ({ ...prev, issuedBookLoading: true }));
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/analytics/issued-books-per-month`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setIssuedBooks(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, issuedBookLoading: false }));
    }
  };
  const fetchactiveUsers = async () => {
    setLoading((prev) => ({ ...prev, usersLoading: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/analytics/users-per-month`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        setActiveUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, usersLoading: false }));
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
    fetchactiveUsers();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {loading.issuedBookLoading ? (
        <div className="flex justify-center my-8">
          {" "}
          <Loader width={9} height={40} />
        </div>
      ) : (
        <IssuedBooksChart issuedBooksData={issuedBooks} />
      )}

      {loading.usersLoading ? (
        <div className="flex justify-center my-8">
          {" "}
          <Loader width={9} height={40} />
        </div>
      ) : (
        <MonthlyUsersChart activeUsersData={activeUsers} />
      )}
    </div>
  );
};

export default BarChartsWrapper;
