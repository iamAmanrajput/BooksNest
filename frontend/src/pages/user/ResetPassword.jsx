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
import { BookOpen, CheckCircle, ArrowLeft } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validate password strength or length
  const validatePasswords = () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message || "Password reset successfully");
        setSubmitted(true);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#09090b] px-4 relative">
        {/* Mode Toggle */}
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardContent className="py-10 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/40 mb-3">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
              Password Reset Successful
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your password has been reset. You can now sign in with your new
              password.
            </p>
            <Button asChild className="w-full">
              <Link to="/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign in
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-2 text-center text-xs text-muted-foreground">
            &copy; 2025 NexLib. All rights reserved.
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main Form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#09090b] px-4 relative">
      {/* Mode Toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-customblue" />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              NexLib
            </h1>
          </div>
          <CardTitle className="text-xl text-center pt-2">
            Reset Your Password
          </CardTitle>
          <div className="text-base text-center text-muted-foreground">
            Enter your new password below to reset your account password.
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
                value={password}
                required
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                required
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? <Loader /> : "Reset Password"}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 mt-4 text-center">
            <Button asChild variant="ghost" className="w-full text-sm">
              <Link to="/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign in
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground text-center">
        &copy; 2025 NexLib. All rights reserved.
      </div>
    </div>
  );
};

export default ResetPassword;
