import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import React, { useState } from "react";

const PopularBooks = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-customGray">
          Popular Books
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <Badge variant="secondary" className="w-7 h-7 rounded-full">
              1
            </Badge>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium leading-none truncate">
                {"dark dbdgMastering Data Structures and..".length > 23
                  ? "dark dbdgMastering Data Structures and..".slice(0, 23) +
                    "..."
                  : "dark dbdgMastering Data Structures and.."}
              </h3>
              <p className="text-xs sm:text-sm mt-1 truncate text-customGray">
                aman sinfg
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-customYellow" />{" "}
            <span className="text-customGray text-xl font-bold">5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularBooks;
