// components/StatCard.jsx
import React from "react";

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
  // Add more colors as needed
};

const StatCard = ({ icon: Icon, title, value, color = "blue" }) => {
  const current = colorStyles[color] || colorStyles["blue"];

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border-l-4 ${current.border}`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${current.bg} ${current.text}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-customIsabelline">
            {title}
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-customIsabelline">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
