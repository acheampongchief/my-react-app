
 function CalorieGoal({ goal, setGoal }) {
  return (
    <div className="mt-4">
      <label className="block text-lg font-semibold">Enter your calorie goal:</label>
      <input
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border rounded p-2 mt-2"
      />
    </div>
  );
}
export default CalorieGoal;

