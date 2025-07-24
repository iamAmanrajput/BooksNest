import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const TopBorrowedBooks = ({ topBorrowedBooksData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Borrowed Books</CardTitle>
        <CardDescription>Most popular books of all time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topBorrowedBooksData?.map((book, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">
                      {book?.title?.split(" ").slice(0, 4).join(" ") +
                        (book?.title?.split(" ").length > 4 ? " ..." : "")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {book?.authors[0]}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {book?.genres[0]}
                </Badge>
                <span className="text-sm font-medium">{book?.borrowCount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopBorrowedBooks;
