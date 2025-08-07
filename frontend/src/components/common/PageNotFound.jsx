import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "@/components/common/ModeToggle";
import { useSelector } from "react-redux";

const PageNotFound = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 px-6 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-gray-100/40 dark:bg-grid-zinc-800/40 bg-[size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 dark:to-zinc-900/30 pointer-events-none" />

      {/* Mode Toggle top-right */}
      <div className="absolute top-6 right-6 z-20">
        <ModeToggle />
      </div>

      {/* Main Card Container with 80vw width */}
      <div className="relative z-10 w-[80vw] max-w-2xl mx-auto">
        <Card className="rounded-3xl border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg shadow-2xl overflow-hidden transition-colors duration-500">
          <CardContent className="p-8 sm:p-12 text-center space-y-8">
            {/* Logo + Title */}
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="p-4 rounded-3xl bg-customblue/20 dark:bg-customblue/30 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-12 h-12 text-customblue" />
                </div>
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 select-none">
                  BooksNest
                </h3>
              </div>

              <div className="space-y-4">
                <div className="text-9xl font-black text-customblue/25 dark:text-customblue/35 select-none leading-none tracking-tight">
                  404
                </div>
                <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Oops! Page Not Found
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto text-base sm:text-lg">
                  The page you’re looking for seems lost in the digital wild.
                  Let’s get you back on track.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 pt-2">
              <Link
                to={
                  role === "user"
                    ? "/home"
                    : role === "admin"
                    ? "/admin/dashboard"
                    : "/signin"
                }
                className="w-full sm:w-auto"
                aria-label="Back to home"
              >
                <Button
                  size="lg"
                  className="flex items-center gap-3 bg-customblue hover:bg-customblue/90 text-white shadow-lg hover:shadow-xl rounded-xl px-10 py-3 transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-3 border-2 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl px-10 py-3 transition-all duration-300 w-full sm:w-auto"
                onClick={() => window.history.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-700 text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                to="/contact"
                className="text-customblue hover:text-customblue/80 font-medium underline underline-offset-2 transition-colors duration-300"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Floating Decorations */}
        <div className="pointer-events-none">
          <div className="absolute -top-6 -left-6 w-28 h-28 bg-customblue/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-customblue/8 rounded-full blur-4xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-600 to-transparent pointer-events-none" />
    </div>
  );
};

export default PageNotFound;
