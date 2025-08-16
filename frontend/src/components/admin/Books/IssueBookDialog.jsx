import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, Mail, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import Loader from "@/components/common/Loader";

const IssueBookDialog = ({ bookDetails, onQuantityUpdate }) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // Basic validation
    if (!trimmedEmail) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }

    if (!bookDetails?._id) {
      toast.error("Book ID is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/borrow/issueBook`,
        {
          email: trimmedEmail,
          bookId: bookDetails._id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "Book issued successfully");
        setEmail("");
        onQuantityUpdate(bookDetails._id);
        setIsModelOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDialog = () => {
    setEmail("");
    setIsModelOpen(false);
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DialogTrigger asChild>
        <Button
          className={`flex-1 ${
            bookDetails?.availableQuantity === 0
              ? "bg-red-800/60 text-white hover:bg-red-800 border border-red-700"
              : ""
          }`}
        >
          <Send className="h-4 w-4" />
          Lend
        </Button>
      </DialogTrigger>

      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="text-customblue" />
            <span className="font-bold text-2xl">Issue Book</span>
          </DialogTitle>
        </DialogHeader>

        {/* Book Details */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <img
                src={bookDetails?.coverImage.imageUrl || "/placeholder.svg"}
                alt={bookDetails?.title}
                width={60}
                height={80}
                className="rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {bookDetails?.title}
                </h3>
                <p className="text-muted-foreground text-sm truncate">
                  {bookDetails?.authors?.[0] || "Unknown Author"}
                </p>
                <div className="mt-2 text-xs sm:text-sm">
                  Available: {bookDetails?.availableQuantity}/
                  {bookDetails?.quantity}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="userEmail">User Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="userEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user's email address"
                className="pl-10"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDialog}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto"
            >
              {loading ? <Loader /> : "Borrow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IssueBookDialog;
