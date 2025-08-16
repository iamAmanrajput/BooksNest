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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CalendarCheck,
  Clock,
  Edit,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  Upload,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import PayFine from "@/components/user/profile/PayFine";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [issuedBooks, setIssuedBooks] = useState(0);
  const [loading, setLoading] = useState({
    fetchUserLoading: false,
    saveProfileLoading: false,
    updatePasswordLoading: false,
    uploadPicLoading: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [error, setError] = useState("");
  const [isPicEditModelOpen, setIsPicEditModelOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // handle save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    setLoading((prev) => ({ ...prev, saveProfileLoading: true }));

    const { fullName, email } = userFormData;

    // Validations
    if (!fullName?.trim()) {
      setLoading((prev) => ({ ...prev, saveProfileLoading: false }));
      return toast.error("Full name is required.");
    }

    if (!email?.trim()) {
      setLoading((prev) => ({ ...prev, saveProfileLoading: false }));
      return toast.error("Email is required.");
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setLoading((prev) => ({ ...prev, saveProfileLoading: false }));
      return toast.error("Enter a valid email address.");
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
        const updatedUser = response.data.data;

        // Update form state and global user data
        setUserFormData(updatedUser);
        setUserData((prev) => ({
          ...prev,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          gender: updatedUser.gender,
        }));

        setIsEditing(false);
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, saveProfileLoading: false }));
    }
  };

  // handle update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading((prev) => ({ ...prev, updatePasswordLoading: true }));

    const { currentPassword, newPassword, confirmPassword } = passwords;

    // Input Validations
    if (!currentPassword.trim()) {
      setError("Current Password is required");
      setLoading((prev) => ({ ...prev, updatePasswordLoading: false }));
      return;
    }
    if (!newPassword.trim()) {
      setError("New Password is required");
      setLoading((prev) => ({ ...prev, updatePasswordLoading: false }));
      return;
    }
    if (!confirmPassword.trim()) {
      setError("Confirm Password is required");
      setLoading((prev) => ({ ...prev, updatePasswordLoading: false }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading((prev) => ({ ...prev, updatePasswordLoading: false }));
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading((prev) => ({ ...prev, updatePasswordLoading: false }));
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/updatePassword`,
        { currentPassword, newPassword, confirmPassword },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success("Password updated successfully");

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        dispatch(setUserLogout());

        try {
          if (localStorage.getItem("accessToken")) {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });
          }
        } catch (logoutError) {
          console.error("Logout failed:", logoutError);
        }

        navigate("/signin");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading((prev) => ({ ...prev, updatePasswordLoading: false }));
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfilePic = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      return toast.error("Please select a file");
    }
    setLoading((prev) => ({ ...prev, uploadPicLoading: true }));
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/updateProfilePic`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success("Profile picture updated");
        setUserData((prev) => ({
          ...prev,
          profilePic: response.data.data,
        }));
        setIsPicEditModelOpen(false);
        setProfilePicPreview("");
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading((prev) => ({ ...prev, uploadPicLoading: false }));
    }
  };

  const handleCancelPicUpload = () => {
    setIsPicEditModelOpen(false);
    setSelectedFile(null);
    setProfilePicPreview("");
  };

  const handleClearPreview = () => {
    setSelectedFile(null);
    setProfilePicPreview("");
  };

  const clearFine = () => {
    setUserData((prev) => ({ ...prev, fineAmount: 0 }));
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
          <div className="relative w-36 h-36">
            <Avatar className="w-36 h-36 border-4 border-zinc-300 dark:border-zinc-700 shadow-xl">
              <AvatarImage
                src={userData?.profilePic?.imageUrl}
                alt={userData?.fullName || "NA"}
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
            <Edit
              onClick={() => setIsPicEditModelOpen(true)}
              className="absolute bottom-2 w-7 h-7 right-1 z-20 text-blue-500 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* Name + Email + Badges */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">{userData?.fullName || "NA"}</h1>
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <Mail className="text-customblue h-5 w-5" />
            {userData?.email || "NA"}
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

      {/* PayFine Container */}
      <PayFine
        clearFineHandler={clearFine}
        amount={userData?.fineAmount || 0}
      />

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

              <Button
                type="submit"
                disabled={loading.updatePasswordLoading}
                className="w-full"
              >
                {loading.updatePasswordLoading ? (
                  <Loader />
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-1" />
                    Update Password
                  </>
                )}
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

      {/* Profile Photo Update Dialog */}
      <Dialog open={isPicEditModelOpen} onOpenChange={setIsPicEditModelOpen}>
        <DialogContent className="max-w-lg w-[90vw] max-h-[90vh] bg-white dark:bg-zinc-900 border-0 text-zinc-900 dark:text-zinc-100 shadow-2xl rounded-2xl p-0">
          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <DialogTitle className="text-xl font-bold flex gap-3 items-center">
              <Upload className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              <span>Update Profile Picture</span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <ScrollArea className="max-h-[70vh]">
            <div className="px-6 py-6 space-y-8">
              {/* Avatar Preview */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <Avatar className="relative w-40 h-40 border-4 border-white dark:border-zinc-800 shadow-xl ring-4 ring-zinc-100 dark:ring-zinc-800/50">
                    <AvatarImage
                      src={
                        profilePicPreview ||
                        "/placeholder.svg?height=160&width=160"
                      }
                      alt="Profile Preview"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-800 dark:text-zinc-200 font-bold">
                      {userData?.fullName
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {profilePicPreview && (
                    <X
                      onClick={handleClearPreview}
                      className="absolute top-4 right-2 w-6 h-6 z-20 text-customGray bg-white dark:bg-zinc-900 rounded-full p-1 shadow-md cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Select Image File
                </Label>
                <div className="relative">
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-200">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          JPG, PNG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 animate-pulse rounded-full"></div>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Supported formats: JPG, PNG, GIF • Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSaveProfilePic}
                  disabled={!profilePicPreview || loading.uploadPicLoading}
                  className="flex-1 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.uploadPicLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3" />
                      <span>Save Picture</span>
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPicUpload}
                  disabled={loading.uploadPicLoading}
                  className="h-12 px-6 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 bg-transparent"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProfile;
