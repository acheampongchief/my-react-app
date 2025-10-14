// WelcomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserName from "../components/userInfo";
import CalorieGoal from "../components/calorieGoal";

const WelcomePage = () => {
  const [userName, setUserName] = useState("");
  const [goal, setGoal] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!userName || !goal) {
      alert("Please enter your name and calorie goal to continue.");
      return;
    }

    // Save to local storage (optional)
    localStorage.setItem("userName", userName);
    localStorage.setItem("goal", goal);

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100">
      {/* App Logo or Icon */}
      <h1 className="text-5xl font-extrabold text-orange-600 mb-4">🍎 CalorieSnap</h1>

      {/* App Description */}
      <p className="text-center text-gray-600 mb-8 px-6">
        Track your meals effortlessly — snap a photo and let AI calculate your nutrients!
      </p>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        {/* User Name Input */}
        <UserName onNameSet={setUserName} />

        {/* Calorie Goal Input */}
        <CalorieGoal onGoalSet={setGoal} />

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-all"
        >
          Start Tracking
        </button>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-6">
        Made with ❤️ by Chief Yaw
      </p>
    </div>
  );
};

export default WelcomePage;
