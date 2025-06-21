import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "@/components/common/ModeToggle";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-zinc-800 px-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-lg shadow-xl rounded-2xl border-none bg-white dark:bg-zinc-900 text-center">
        <CardContent className="py-12 px-6 space-y-6">
          {/* Icon and Title */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-12 h-12 text-customblue" />
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                BooksNest
              </h3>{" "}
            </div>

            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              404 – Page Not Found
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Button */}
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go back Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageNotFound;
