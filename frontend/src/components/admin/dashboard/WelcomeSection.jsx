import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WelcomeSection = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 mt-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl capitalize text-zinc-900 dark:text-zinc-100  font-bold">
              Welcome back, Admin!
            </h1>
            <p className="mt-1  text-zinc-600 dark:text-zinc-400 text-sm sm:text-base ">
              Here's what's happening in your library today
            </p>
          </div>
          <div className="flex flex-col space-y-1 sm:items-end">
            <div className="flex items-center text-xs sm:text-sm  text-zinc-600 dark:text-zinc-400">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">{currentDate}</span>
              <span className="sm:hidden">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-xs sm:text-sm  text-zinc-600 dark:text-zinc-400">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {currentTime}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
