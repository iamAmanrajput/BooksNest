import React from "react";

const StatCard = ({ icon: Icon, title, value, color = "blue" }) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-customIsabelline">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-customIsabelline">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
