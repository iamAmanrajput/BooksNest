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
import { BookOpen, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";
import { Link } from "react-router-dom";
import Loader from "@/components/common/Loader";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => setEmail(e.target.value);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email.trim()) {
      toast.error("Email is Required");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      setSubmitted(true);
      toast.success(response?.data?.message || "Link Sent Successfully");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Success UI
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#09090b] px-4 relative">
        {/* Mode Toggle in corner */}
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        {/* Card with success message */}
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/40 mb-3">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
              Check Your Email
            </h2>
            <div className="text-sm text-muted-foreground mb-6 text-center">
              We've sent a password reset link to
              <br />
              <span className="font-medium text-foreground">{email}</span>
              <br />
              The link is valid for only <b>1 hour</b>.
            </div>
            <Button asChild className="w-full mb-2">
              <Link to="/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign in
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setSubmitted(false)}
            >
              Try Another Email
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-2 text-center text-xs text-muted-foreground">
            Didn’t receive the email? Check spam or
            <button
              className="underline text-primary cursor-pointer"
              onClick={() => setSubmitted(false)}
              type="button"
            >
              try again
            </button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-sm text-muted-foreground text-center">
          &copy; 2024 BookNest. All rights reserved.
        </div>
      </div>
    );
  }

  // Main Forgot Password Form
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
              BooksNest
            </h1>
          </div>
          <CardTitle className="text-xl text-center pt-2">
            Forgot Password
          </CardTitle>
          <div className="text-base text-center text-muted-foreground">
            Enter your email and we’ll send you a reset link!
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                required
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={loading || !email}
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-4 text-center">
            <Button asChild variant="ghost" className="w-full text-sm">
              <Link to="/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign in
              </Link>
            </Button>
            <div className="text-xs text-muted-foreground mt-2">
              Need help?{" "}
              <a href="mailto:support@booknest.com" className="underline ">
                Contact Support
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-8 text-sm text-muted-foreground text-center">
        &copy; 2025 BooksNest. All rights reserved.
      </div>
    </div>
  );
};

export default ForgotPassword;
