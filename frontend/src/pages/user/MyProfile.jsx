import Loader from "@/components/common/Loader";
import StatCard from "@/components/common/StatCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTime } from "@/constants/Helper";
import axios from "axios";
import {
  Activity,
  BookOpen,
  Calendar,
  CalendarCheck,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  IndianRupee,
  Key,
  Mail,
  Save,
  Settings,
  Shield,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [issuedBooks, setIssuedBooks] = useState(0);
  const [loading, setLoading] = useState({
    fetchUserLoading: false,
    saveProfileLoading: false,
    updatePasswordLoading: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [error, setError] = useState("");
  const [userFormData, setUserFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading((prev) => ({ ...prev, fetchUserLoading: true }));
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile/currentUser`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          const user = response.data.data;
          setUserData(user);
          setIssuedBooks(response?.data?.issuedBooksCount);
          setTotalBorrowedBooks(response?.data?.totalBorrowedBooks);
          setUserFormData((prev) => ({
            ...prev,
            fullName: user?.fullName,
            email: user?.email,
            gender: user?.gender,
          }));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading((prev) => ({ ...prev, fetchUserLoading: false }));
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, saveProfileLoading: true }));

    if (!userFormData.fullName?.trim()) {
      return toast.error("Username is required.");
    }

    if (!userFormData.email?.trim()) {
      return toast.error("Email is required.");
    }

    if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      return toast.error("Enter a valid email.");
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/updateProfile`,
        userFormData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        const user = response.data.data;

        setUserFormData(user);
        setUserData((prev) => ({
          ...prev,
          fullName: user.fullName,
          email: user.email,
          gender: user.gender,
        }));
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, saveProfileLoading: false }));
    }
  };

  //Todo
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, updatePasswordLoading: true }));
    if (!passwords.currentPassword.trim()) {
      toast.error("Current Password is Required");
    }
    if (!passwords.newPassword.trim()) {
      toast.error("Current Password is Required");
    }
    if (!passwords.confirmPassword.trim()) {
      toast.error("Current Password is Required");
    }

    if (
      !passwords.currentPassword.trim() ||
      !passwords.newPassword.trim() ||
      !passwords.confirmPassword.trim()
    ) {
      return toast.error();
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("Password update submitted", passwords);

    // Reset fields
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  return loading.fetchUserLoading ? (
    <div className="flex justify-center my-10">
      {" "}
      <Loader width={9} height={40} />
    </div>
  ) : (
    <div className="px-4 py-6 flex flex-col items-center bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 min-h-screen">
      {/* Profile Stats Container */}
      <div className="w-full gap-6 grid grid-cols-1 md:grid-cols-3">
        <StatCard
          icon={BookOpen}
          title="Total Borrowed"
          value={loading.fetchUserLoading ? null : totalBorrowedBooks}
          color="blue"
        />
        <StatCard
          icon={Wallet}
          title="Total Fine"
          value={loading.fetchUserLoading ? null : `₹ ${userData?.fineAmount}`}
          color="red"
        />
        <StatCard
          icon={CalendarCheck}
          title="Member Since"
          value={
            loading.fetchUserLoading
              ? null
              : formatDateTime(userData?.createdAt)?.date
          }
          color="green"
        />
      </div>

      {/* Profile Container */}
      <div className="w-full mt-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-4 sm:p-6 text-zinc-900 dark:text-zinc-100">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <Avatar className="w-36 h-36 border-4 border-zinc-300 dark:border-zinc-700 shadow-xl">
            <AvatarImage
              src={userData?.profilePic?.imageUrl}
              alt={userData?.fullName}
            />
            <AvatarFallback className="text-3xl capitalize bg-zinc-800 text-white border-2 border-zinc-700">
              {userData?.fullName
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name + Email + Badges */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Aman Singh</h1>
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <Mail className="text-customblue h-5 w-5" />
            aman.it360@gmail.com
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <Badge className="bg-zinc-200 text-zinc-800 border border-zinc-300 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700">
              <Shield className="w-3 h-3 mr-1" />
              User
            </Badge>
            <Badge className="bg-zinc-200 text-zinc-800 border border-zinc-300 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700 capitalize">
              <UserCheck className="w-3 h-3 mr-1" />
              Male
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center shadow">
            <BookOpen className="w-8 h-8 text-customblue mx-auto mb-2" />
            <p className="text-2xl font-bold">{issuedBooks}</p>
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Issued Books
            </p>
          </div>
          <div className="rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center shadow">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{userData?.wishlist?.length}</p>
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Wishlist Items
            </p>
          </div>
        </div>

        {/* Account ID */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
            Account ID
          </p>
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300">
            {userData?._id}
          </code>
        </div>
      </div>

      {/* Personel Information */}
      <Card className="bg-white mt-6 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg w-full">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 sm:items-center items-start justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-xl">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 text-xs font-bold">
                  Update your personal information
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() =>
                isEditing ? handleSaveProfile() : setIsEditing(true)
              }
              disabled={loading.saveProfileLoading}
              className={
                isEditing
                  ? "bg-customblue self-center sm:self-auto text-white hover:bg-blue-700"
                  : "bg-zinc-800 self-center sm:self-auto text-white hover:bg-zinc-700 border border-zinc-700"
              }
            >
              {isEditing ? (
                loading.saveProfileLoading ? (
                  <Loader color="#FFFFFF" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )
              ) : (
                <Edit3 className="w-4 h-4 mr-2" />
              )}
              {isEditing
                ? loading.saveProfileLoading
                  ? ""
                  : "Save Changes"
                : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className=" p-8 pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300 font-medium">
                Full Name
              </Label>
              <Input
                value={userFormData.fullName}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, fullName: e.target.value })
                }
                disabled={!isEditing}
                className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-customblue focus:ring-customblue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300 font-medium">
                Email Address
              </Label>
              <Input
                type="email"
                value={userFormData.email}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, email: e.target.value })
                }
                disabled={!isEditing}
                className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-customblue focus:ring-customblue"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300 font-medium">
              Gender
            </Label>
            <Select
              value={userFormData.gender}
              onValueChange={(value) =>
                setUserFormData({ ...userFormData, gender: value })
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-white disabled:opacity-50">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                onClick={handleSaveProfile}
                disabled={loading.saveProfileLoading}
                className="flex-1 bg-customblue text-white hover:bg-blue-700"
              >
                {loading.saveProfileLoading ? (
                  <Loader color="#FFFFFF" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className={`shadow-lg mt-6 w-full`}>
        <CardHeader
          className={`${
            showPasswordSection && "border-b"
          } bg-white dark:bg-zinc-900`}
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-zinc-400" />
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-xl">
                  Security Settings
                </CardTitle>
                <CardDescription className="dark:text-zinc-400 text-xs font-bold mt-1">
                  Modify password and enhance your account security.
                </CardDescription>
              </div>
            </div>
            <Button
              className="bg-zinc-800 text-white hover:bg-zinc-700 self-center sm:self-auto border border-zinc-700"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? (
                <EyeOff className="w-4 h-4 " />
              ) : (
                <Eye className="w-4 h-4 " />
              )}
              {showPasswordSection ? "Hide" : "Show"}
            </Button>
          </div>
        </CardHeader>

        {showPasswordSection && (
          <CardContent className="p-8 pt-4">
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-300 font-medium">
                  Current Password
                </Label>
                <Input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter your current password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300 font-medium">
                  New Password
                </Label>
                <Input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  placeholder="Enter your new password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300 font-medium">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your new password"
                />
              </div>
              {error && (
                <div className="w-full bg-red-100 text-red-700 border border-red-400 rounded-md p-3">
                  <p className="text-center font-medium break-words">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full">
                <Key className="w-4 h-4 mr-1" />
                Update Password
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Activity Timeline */}
      <Card className="bg-white w-full mt-6 dark:bg-zinc-900 shadow-lg">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-zinc-900 dark:text-white text-xl">
                Account Activity
              </CardTitle>
              <CardDescription className="text-zinc-600 text-xs font-bold dark:text-zinc-400">
                Recent activity and account timeline
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <div className="space-y-4">
            {/* Last Updated */}
            <div className="flex items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
              <div className="w-3 h-3 bg-yellow-500 animate-pulse rounded-full"></div>
              <div className="flex-1">
                <p className="text-zinc-800 dark:text-white font-medium">
                  Profile Last Updated
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  {formatDateTime(userData?.profileLastUpdated).date}
                </p>
              </div>
              <Clock className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
              <div className="w-3 h-3 bg-green-500 animate-pulse  rounded-full"></div>
              <div className="flex-1">
                <p className="text-zinc-800 dark:text-white font-medium">
                  Account Created
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  {formatDateTime(userData?.createdAt).date}
                </p>
              </div>
              <Clock className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
