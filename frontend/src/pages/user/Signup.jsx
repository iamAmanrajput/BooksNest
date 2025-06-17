"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black opacity-90"></div>

      <Card className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-md bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Join us today and get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-200 font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 bg-zinc-700/50 text-white placeholder:text-zinc-400 border-zinc-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-12 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-zinc-700/50 text-white placeholder:text-zinc-400 border-zinc-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-12 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-zinc-700/50 text-white placeholder:text-zinc-400 border-zinc-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-12 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label className="text-zinc-200 font-medium">Gender</Label>
              <RadioGroup
                defaultValue="male"
                onValueChange={(val) =>
                  setFormData({ ...formData, gender: val })
                }
                className="flex flex-wrap gap-4"
              >
                {["male", "female", "other"].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={gender}
                      id={gender}
                      className="border-zinc-500 text-purple-500 focus:ring-purple-500/20"
                    />
                    <Label
                      htmlFor={gender}
                      className="text-zinc-300 capitalize cursor-pointer hover:text-white transition-colors"
                    >
                      {gender}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]"
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-zinc-400 text-sm">
              Already have an account?{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
