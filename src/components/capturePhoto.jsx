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

      // Send image file to backend
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData, // 👈 no need for headers when sending FormData
      });

      const data = await response.json();
      setResult(data);
      onAnalysisComplete?.(data); // optional callback to parent
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
            <div className="mt-4 text-center">
              {result.error ? (
                <p className="text-red-500 font-semibold">{result.error}</p>
              ) : (
                <>
                  <p className="text-lg font-semibold text-orange-600">
                    🍽️ Food: <span className="font-bold">{result.food}</span>
                  </p>
                  <p className="text-lg font-semibold text-pink-600">
                    🔥 Calories:{" "}
                    <span className="font-bold">
                      {result.calories !== "Unknown"
                        ? `${result.calories} kcal`
                        : "Unknown"}
                    </span>
                  </p>
                  {result.confidence && (
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence: {result.confidence}
                    </p>
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
