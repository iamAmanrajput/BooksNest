import React, { useEffect, useState } from "react";
import UserFilterPanel from "@/components/admin/users/UserFilterPanel";
import UsersPage from "@/components/admin/users/UsersPage";
import UserStats from "@/components/admin/users/UserStats";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setData, setLoading } from "@/redux/slices/usersSlice";
import { toast } from "sonner";

const AllUsers = () => {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();

  const { pagination } = useSelector((state) => state.users);

  const fetchUsersData = async (page = 1) => {
    dispatch(setLoading({ fetchUsersLoading: true }));
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/users?email=${email}&category=${category}&page=${page}&limit=${
          pagination.pageSize
        }`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response?.data?.success) {
        dispatch(setData(response.data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setLoading({ fetchUsersLoading: false }));
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [email, category]);

  return (
    <div className="px-4 pb-6 flex flex-col gap-6 bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <UserStats />
      <UserFilterPanel
        email={email}
        setEmail={setEmail}
        category={category}
        setCategory={setCategory}
      />
      <UsersPage fetchUsersData={fetchUsersData} />
    </div>
  );
};

export default AllUsers;
