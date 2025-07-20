import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Eye,
  IndianRupee,
  Mail,
  RotateCcw,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/common/StatCard";
import BorrowingHistoryCard from "./BorrowingHistoryCard";

const UserProfileDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition">
          <Eye className="w-5 h-5" /> View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[95vw] sm:!w-[90vw] !h-[95vh] !max-w-none sm:!max-w-5xl p-4 sm:p-6 sm:rounded-lg rounded-none overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
          <DialogDescription>
            Displays detailed information about the selected user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {/* Profile Information */}
          <div className="p-4 border rounded-2xl bg-zinc-900">
            <div className="flex gap-3 items-center justify-center sm:justify-start">
              <User strokeWidth={3} />
              <span className="text-2xl font-bold">Profile Information</span>
            </div>

            {/* User Details */}
            <div className="flex mt-4 flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 sm:h-20 sm:w-20 shadow-md">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {"aman singh"
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-xl leading-tight">
                    Aman Singh
                  </p>
                  <p className="text-customGray text-sm flex items-center gap-1 mt-1">
                    <Mail size={15} className="text-customblue" />
                    aaman.it360@gmail.com
                  </p>
                  <p className="text-customGray text-sm flex items-center gap-1 mt-1">
                    <CalendarDays size={15} className="text-customblue" />
                    25-jan-2025
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge className="font-bold bg-green-600 text-white text-xs px-3 py-1 rounded-md">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 rounded-2xl border">
            <StatCard icon={BookOpen} title="Issued" value={10} color="blue" />
            <StatCard
              icon={RotateCcw}
              title="Returned"
              value={5}
              color="green"
            />
            <StatCard
              icon={AlertTriangle}
              title="Overdue"
              value={20}
              color="orange"
            />
            <StatCard
              icon={IndianRupee}
              title="Total Fines"
              value={200}
              color="red"
            />
          </div>
          {/* Borrowing History */}
          <div className="p-4 border rounded-2xl grid grid-cols-1 gap-4 md:grid-cols-3">
            <BorrowingHistoryCard />
            <BorrowingHistoryCard />
            <BorrowingHistoryCard />
            <BorrowingHistoryCard />
            <BorrowingHistoryCard />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
