// DashboardPage.jsx
import  { useState } from "react";
import CameraCapture from "../components/capturePhoto";
import FoodNutrients from "../components/foodNutrients";
import ProgressCircle from "../components/ProgressCircle";

const DashboardPage = () => {
  const [foodInfo, setFoodInfo] = useState(null);
  const [goal] = useState(2000); 
  const calories = foodInfo?.calories || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-6">
      <h1 className="text-3xl text-center font-bold text-orange-600 pt-6">
        🍎 Calorie Progress
      </h1>

      <CameraCapture onFoodDetected={setFoodInfo} />

      <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-md p-4">
        <ProgressCircle calories={calories} goal={goal} />
      </div>

      {foodInfo && <FoodNutrients foodInfo={foodInfo} />}
    </div>
  );
};

export default DashboardPage;
