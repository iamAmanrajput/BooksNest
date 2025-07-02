import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "@/components/common/ModeToggle";
import { useSelector } from "react-redux";

const PageNotFound = () => {
  const { role } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen pt-10 sm:p-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-zinc-800/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 dark:to-zinc-900/20" />
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="rounded-3xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-center shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-10 space-y-6">
            {/* Logo + Title */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 group">
                <div className="p-3 rounded-2xl bg-customblue/10 dark:bg-customblue/20 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-customblue" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  BooksNest
                </h3>
              </div>
              <div className="space-y-3">
                <div className="text-8xl sm:text-9xl font-black text-customblue/20 dark:text-customblue/30 select-none">
                  404
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Oops! Page Not Found
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto text-base sm:text-lg">
                  The page you're looking for seems lost in the digital wild.
                </p>
              </div>
            </div>

            {/* Actions */}
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to={
                  role === "user"
                    ? "/"
                    : role === "admin"
                    ? "/admin/dashboard"
                    : "/signin"
                }
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="gap-2 bg-customblue hover:bg-customblue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3 w-full sm:w-auto"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl px-8 py-3 transition-all duration-300 bg-transparent w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                to="/contact"
                className="text-customblue hover:text-customblue/80 font-medium underline underline-offset-2"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Floating Decorations */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-customblue/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-customblue/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-600 to-transparent" />
    </div>
  );
};

export default PageNotFound;
