import React, { useState } from "react";

function CameraCapture({ onAnalysisComplete }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setResult(null);
    setLoading(true);

    try {
      // Create a FormData object to send the image file
      const formData = new FormData();
      formData.append("image", file); // backend expects "image"

      // Send image file to backend (new endpoint)
      const response = await fetch("http://localhost:5000/api/analyze-photo", {
        method: "POST",
        body: formData, // 👈 no need for headers when sending FormData
      });

      const data = await response.json();
      // Normalize response for older code expecting `food`/`calories` keys
      const normalized = {
        food: data.foodName || data.food || 'Unknown',
        calories: data.calories ?? data.calories === 0 ? data.calories : (data.calories === null ? 'Unknown' : data.calories),
        confidence: data.confidence || null,
        protein: data.protein ?? null,
        carbs: data.carbs ?? null,
        fat: data.fat ?? null,
        rawLabels: data.rawLabels || [],
        error: data.error || null,
      };

      setResult(normalized);
      onAnalysisComplete?.(normalized); // optional callback to parent
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult({ error: "Error analyzing image" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-6 drop-shadow">
        🍓 Snap Your Meal!
      </h2>

      {/* File input button */}
      <label className="cursor-pointer flex flex-col items-center bg-gradient-to-r from-pink-400 to-orange-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-105 transition mb-6">
        <span className="mb-2 text-lg">Choose or Take a Photo</span>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
        />
        <span className="text-2xl">📸</span>
      </label>

      {/* Loading indicator */}
      {loading && (
        <p className="text-orange-500 font-semibold animate-pulse">
          Analyzing image...
        </p>
      )}

      {/* Preview and result */}
      {image && (
        <div className="flex flex-col items-center mt-4">
          <h3 className="text-xl font-bold text-orange-500 mb-2">Preview:</h3>
          <img
            src={image}
            alt="Captured"
            className="rounded-2xl border-4 border-pink-300 shadow-md w-72 h-72 object-cover"
          />

          {/* Display AI results */}
          {result && !loading && (
            <div className="mt-4 text-center w-full max-w-md">
              {result.error ? (
                <p className="text-red-500 font-semibold">{result.error}</p>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-lg font-semibold text-orange-600">
                      🍽️ Food: <span className="font-bold">{result.food}</span>
                    </p>
                    {result.confidence && (
                      <span className="text-sm px-2 py-1 rounded-full bg-indigo-600 text-white font-medium shadow">
                        {result.confidence}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/60 rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-gray-500">Calories</div>
                      <div className="font-bold text-pink-600">
                        {result.calories && result.calories !== 'Unknown' ? `${result.calories} kcal` : 'Unknown'}
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-gray-500">Protein</div>
                      <div className="font-bold text-orange-600">{result.protein ?? '—'} g</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-gray-500">Carbs</div>
                      <div className="font-bold text-indigo-600">{result.carbs ?? '—'} g</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-500">Fat</div>
                    <div className="font-semibold text-gray-700">{result.fat ?? '—'} g</div>
                  </div>

                  {/* Raw labels (optional) */}
                  {result.rawLabels && result.rawLabels.length > 0 && (
                    <div className="mt-3 text-left text-xs text-gray-600">
                      <div className="font-medium mb-1">Raw labels</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {result.rawLabels.map((r, i) => (
                          <li key={i}>{r.label} — {(r.confidence * 100).toFixed(1)}%</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
