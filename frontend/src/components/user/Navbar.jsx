import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModeToggle from "../common/ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/redux/slices/authSlice";
import NotificationPopOver from "./NotificationPopover";

const Navbar = () => {
  const location = useLocation();
  const [firstSegment, setFirstSegment] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const segment = location.pathname.split("/")[1];
    setFirstSegment(segment);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(response?.data?.message || "Logout Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      dispatch(setUserLogout());
      navigate("/");
    }
  };

  return (
    <nav className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold capitalize text-zinc-800 dark:text-zinc-100 hover:underline">
          {firstSegment ? firstSegment : "Dashboard"}
        </h1>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <NotificationPopOver />
          <Button onClick={handleLogout} variant="outline" size="icon">
            <LogOut className="size-4 text-zinc-600 dark:text-zinc-300" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
