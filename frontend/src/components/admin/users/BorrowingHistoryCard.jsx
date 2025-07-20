import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BorrowingHistoryCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">The Great Gatsby</CardTitle>
        <CardDescription>Book borrowing details at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Issue Date:</span>
            <span className="font-medium">2024-01-01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Due Date:</span>
            <span className="font-medium">2024-01-15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Return Date:</span>
            <span className="font-medium">2024-01-12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Returned
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fine:</span>
            <span className="text-green-600 font-bold">₹0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BorrowingHistoryCard;
