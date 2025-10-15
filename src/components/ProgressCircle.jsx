// ProgressCircle.jsx

const ProgressCircle = ({ calories, goal }) => {
  if (!goal || !calories) return null;

  const percentage = Math.min((calories / goal) * 100, 100);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center my-6">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#FFE5B4"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center mt-[-90px]">
        <p className="text-lg font-bold text-orange-700">{Math.round(percentage)}%</p>
        <p className="text-sm text-gray-600">{calories}/{goal} kcal</p>
      </div>
    </div>
  );
};

export default ProgressCircle;
