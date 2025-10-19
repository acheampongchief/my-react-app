// ProgressBar.jsx
import React from "react";

const ProgressBar = ({ calories, goal }) => {
  if (!goal || !calories) return null;

  const percentage = Math.min((calories / goal) * 100, 100);

  return (
    <div className="my-6">
      <p className="text-center text-sm mb-1 text-orange-700 font-medium">
        Progress: {Math.round(percentage)}%
      </p>
      <div className="w-full bg-orange-200 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-orange-400 to-pink-400 h-4 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-center text-xs mt-2 text-gray-600">
        {calories} / {goal} kcal consumed
      </p>
    </div>
  );
};

export default ProgressBar;
