import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("bdbgvffv");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Fake validation
    if (
      formData.email !== "test@example.com" ||
      formData.password !== "123456"
    ) {
      setError("Invalid email or password.");
      return;
    }

    // On success: continue login flow
    console.log("Logged in!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBlack px-4">
      <Card className="w-full max-w-md p-6 shadow-xl border border-gray-700 bg-zinc-900 text-white">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-customBlue" />
          <h1 className="text-2xl font-semibold text-customIsabelline tracking-wide">
            BooksNest
          </h1>
        </div>

        <div className="text-center">
          <h2 className="text-center text-3xl font-extrabold text-customIsabelline">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-customGray">
            Welcome to the Library Management System
          </p>
        </div>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="mt-2 space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="border-zinc-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-zinc-600"
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-center text-red-400 bg-red-950 border border-red-600 p-2 rounded">
                {error}
              </p>
            )}

            <Button type="submit" className="bg-black w-full hover:bg-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
