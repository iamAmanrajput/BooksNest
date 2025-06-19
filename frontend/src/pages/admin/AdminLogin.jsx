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
import { BookOpen, Eye, EyeOff } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";

const AdminLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email.";
    if (!form.password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Admin Login Data:", form);
    // API call for admin login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-zinc-800 px-4 relative">
      {/* Mode Toggle Button */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="space-y-2">
          {/* Branding */}
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-customblue" />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              BooksNest
            </h1>
          </div>
          {/* Title */}
          <CardTitle className="text-xl text-center">
            Welcome Back, Admin – Sign in to Your Dashboard
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter admin email"
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
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
          </CardContent>

          <CardFooter className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full">
              Login as Admin
            </Button>

            {/* Forgot password */}
            <p className="text-xs text-center text-muted-foreground">
              Forgot your password?{" "}
              <a href="/forgot-password" className="underline">
                Reset here
              </a>
            </p>

            {/* Switch to user login */}
            <p className="text-xs text-center text-muted-foreground">
              Not an admin?{" "}
              <a href="/login" className="underline">
                Login as user
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
