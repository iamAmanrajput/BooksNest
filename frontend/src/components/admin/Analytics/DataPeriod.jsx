import { Card, CardContent } from "@/components/ui/card";
import React from "react";

// Utility function to format month & year
const formatMonthYear = (date) =>
  date.toLocaleString("default", { month: "long", year: "numeric" });

const DataPeriod = () => {
  const now = new Date();

  // Start date: 5 months ago
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endDate = now;

  const formattedStart = formatMonthYear(startDate);
  const formattedEnd = formatMonthYear(endDate);

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Current Data Period</span>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold">
            {formattedStart} - {formattedEnd}
          </p>
          <p className="text-xs text-muted-foreground">
            Last 6 months • Updated daily
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPeriod;
