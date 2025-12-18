import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
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
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Mail,
} from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";
import axios from "axios";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const [toggle, setToggle] = useState("signup-form");

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
        toast.success(response?.data?.message || "Email Sent Successfully");
        setFormData((prev) => ({
          ...prev,
          fullName: "",
          password: "",
          gender: "",
        }));
        setToggle("link-sent");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const obfuscatedEmail = () => {
    if (!formData.email) return "";
    const [user, domain] = formData.email.split("@");
    if (!user || !domain) return formData.email;
    const safeUser =
      user.length <= 2
        ? user[0] + "*"
        : user[0] +
          "*".repeat(Math.max(1, user.length - 2)) +
          user[user.length - 1];
    return `${safeUser}@${domain}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#09090b] px-4 relative">
      {/* Mode Toggle Button in Top Right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      {toggle === "signup-form" && (
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardHeader className="space-y-2">
            {/* Branding Section */}
            <Link to="/" className="flex items-center justify-center gap-2">
              <BookOpen className="w-8 h-8 text-customblue" />
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                NexLib
              </h1>
            </Link>

            {/* Title Section */}
            <CardTitle className="text-xl text-center">
              Join Us – Create Your Account
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Username */}
              <div className="grid gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your full Name"
                />
                {errors.fullName && (
                  <span className="text-xs text-red-500">
                    {errors.fullName}
                  </span>
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
                  <span className="text-xs text-red-500">
                    {errors.password}
                  </span>
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
              <Button disabled={loading} type="submit" className="w-full">
                {loading === true ? <Loader /> : "Sign Up"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      )}

      {toggle === "link-sent" && (
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="border-muted/50 shadow-md">
              <CardHeader className="text-center space-y-2">
                <div className="flex justify-center">
                  <motion.div
                    className="text-emerald-600 dark:text-emerald-400"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  >
                    <CheckCircle2 className="h-14 w-14" aria-hidden="true" />
                  </motion.div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl">
                  Email sent successfully
                </CardTitle>
                <CardDescription>
                  {"Please verify your email, then continue."}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <section className="space-y-6">
                  <div className="text-center text-sm text-muted-foreground">
                    {formData.email ? (
                      <p>{`We sent a verification link to ${obfuscatedEmail()}. Open your inbox and click the link to verify.`}</p>
                    ) : (
                      <p>
                        {
                          "We sent a verification link to your email address. Open your inbox and click the link to verify."
                        }
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://mail.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="col-span-1"
                      aria-label="Open Gmail"
                    >
                      <Button
                        variant="secondary"
                        className="w-full inline-flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {"Gmail"}
                        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                      </Button>
                    </a>
                    <a
                      href="https://outlook.live.com/mail/"
                      target="_blank"
                      rel="noreferrer"
                      className="col-span-1"
                      aria-label="Open Outlook"
                    >
                      <Button
                        variant="secondary"
                        className="w-full inline-flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {"Outlook"}
                        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                      </Button>
                    </a>
                    <a
                      href="https://mail.yahoo.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="col-span-1"
                      aria-label="Open Yahoo Mail"
                    >
                      <Button
                        variant="secondary"
                        className="w-full inline-flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {"Yahoo"}
                        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                      </Button>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to="/signin">
                      <Button className="inline-flex items-center gap-2">
                        {"Continue"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    Tip: If your token has expired, please sign up again to get
                    a new verification link.
                  </div>
                </section>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Signup;
