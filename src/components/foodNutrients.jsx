import React, { useState } from "react";

const FoodNutrients = ({ foodInfo }) => {
  const [goal, setGoal] = useState("");
  const [userName, setUserName] = useState("");

  const { calories, protein, carbs, fat, foodName } = foodInfo || {};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-4">
        🍱 {foodName || "Your Meal"} Nutrients
      </h2>

      {/* User Name Input */}
      <UserName onNameSet={setUserName} />

      {/* Calorie Goal Input */}
      <CalorieGoal onGoalSet={setGoal} />

      {/* Nutrient Details */}
      <Carbs carbs={carbs} />
      <Protein protein={protein} />
      <Fat fat={fat} />

      {/* Calorie Summary */}
      <Calories calories={calories} goal={goal} userName={userName} />
    </div>
  );
};

/* ---------------- SUBCOMPONENTS ---------------- */

// UserName input component
const UserName = ({ onNameSet }) => {
  const [name, setName] = useState("");
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">Enter your name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onNameSet(e.target.value);
        }}
        className="w-full p-2 border border-orange-300 rounded-lg"
        placeholder="e.g. Yaw"
      />
    </div>
  );
};

// Calorie Goal input component
const CalorieGoal = ({ onGoalSet }) => {
  const [goal, setGoal] = useState("");
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">Enter your daily calorie goal:</label>
      <input
        type="number"
        value={goal}
        onChange={(e) => {
          setGoal(e.target.value);
          onGoalSet(e.target.value);
        }}
        className="w-full p-2 border border-orange-300 rounded-lg"
        placeholder="e.g. 2000"
      />
    </div>
  );
};

// Macronutrient display components
const Carbs = ({ carbs }) => (
  <div className="mb-2 text-sm">
    <span className="font-semibold">Carbs:</span> {carbs ? `${carbs} g` : "—"}
  </div>
);

const Protein = ({ protein }) => (
  <div className="mb-2 text-sm">
    <span className="font-semibold">Protein:</span> {protein ? `${protein} g` : "—"}
  </div>
);

const Fat = ({ fat }) => (
  <div className="mb-4 text-sm">
    <span className="font-semibold">Fat:</span> {fat ? `${fat} g` : "—"}
  </div>
);

// Calories summary and comparison with goal
const Calories = ({ calories, goal, userName }) => {
  const difference =
    goal && calories ? Number(goal) - Number(calories) : null;

  return (
    <div className="mt-4 p-3 border-t border-orange-300 text-center">
      <h3 className="font-bold text-lg text-orange-600 mb-2">Calorie Summary</h3>
      <p>
        {userName ? `${userName}, ` : ""}
        this meal has <strong>{calories ?? "—"} kcal</strong>.
      </p>
      {difference !== null && (
        <p className="text-sm mt-2">
          You have <strong>{difference}</strong> kcal left for your daily goal.
        </p>
      )}
    </div>
  );
};

export default FoodNutrients;
