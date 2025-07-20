import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Ban, BookOpen, Eye, IndianRupee, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfileDialog from "./UserProfileDialog";

const UserCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        {/* Left: Avatar + User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 shadow-md">
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
            <p className="font-bold text-xl leading-tight">Aman Singh</p>
            <p className="text-customGray text-sm flex items-center gap-1 mt-1">
              <Mail size={15} className="text-customblue" />
              aaman.it360@gmail.com
            </p>
          </div>
        </div>

        {/* Right: Status Badge */}
        <div className="self-center sm:self-start">
          <Badge className="font-bold bg-green-600 text-white text-xs px-3 py-1 rounded-md">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center gap-6 px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl shadow-sm">
          {/* Issued Books */}
          <div className="space-y-1">
            <p className="text-sm text-zinc-500 font-semibold">Issued Books</p>
            <p className="flex items-center gap-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
              <BookOpen className="text-customblue w-5 h-5" />
              10
            </p>
          </div>

          {/* Total Fine */}
          <div className="space-y-1 text-right">
            <p className="text-sm text-zinc-500 font-semibold">Total Fine</p>
            <p className="flex items-center gap-2 justify-end text-lg font-bold text-zinc-800 dark:text-zinc-100">
              <IndianRupee className="text-customYellow w-5 h-5" />
              10
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex">
        <UserProfileDialog />
        <Button
          variant="destructive"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium"
        >
          <Ban className="w-5 h-5" /> Block User
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
