import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";
import axios from "axios";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));

    setErrors((prev) => ({
      ...prev,
      gender: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email.";

    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!formData.gender) newErrors.gender = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) return;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message || "User Sign Up Successfully");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          gender: "",
        });
        navigate("/signin");
      } else {
        return toast.error(response?.data?.message || "Internal Server Error");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-zinc-800 px-4 relative">
      {/* Mode Toggle Button in Top Right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="space-y-2">
          {/* Branding Section */}
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-customblue" />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              BooksNest
            </h1>
          </div>

          {/* Title Section */}
          <CardTitle className="text-xl text-center">
            Join Us – Create Your Account
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Username */}
            <div className="grid gap-1.5">
              <Label htmlFor="fullName">FullName</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your fullName"
              />
              {errors.fullName && (
                <span className="text-xs text-red-500">{errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-zinc-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </div>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </div>

            {/* Gender */}
            <div className="grid gap-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={handleGenderChange}>
                <SelectTrigger className="cursor-pointer" id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="male">
                    Male
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="female">
                    Female
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <span className="text-xs text-red-500">{errors.gender}</span>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full">
              {loading === true ? <Loader /> : "Sign Up"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/signin" className="underline">
                Login
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
