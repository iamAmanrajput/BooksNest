import Spinner from "@/components/common/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const AnalyticsCard = ({
  icon: Icon,
  title,
  value,
  percentageChange = 0,
  color = "blue",
  showTrend = true,
}) => {
  const colorStyles = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    red: {
      border: "border-red-500",
      bg: "bg-red-100",
      text: "text-red-600",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    orange: {
      border: "border-orange-500",
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    cyan: {
      border: "border-cyan-500",
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },
  };

  const current = colorStyles[color] || colorStyles["blue"];
  const isPositive = percentageChange >= 0;

  return (
    <Card className={`border-0 gap-2 border-l-4 ${current.border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold text-gray-600 dark:text-customIsabelline">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 " />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold ">
          {value != null ? value : <Spinner />}
        </div>
        {value != null && showTrend && (
          <p className="text-xs text-muted-foreground">
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {isPositive ? "+" : "-"}
              {Math.abs(percentageChange)}%
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
