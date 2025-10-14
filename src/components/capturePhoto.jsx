import React, { useState } from 'react';

function CameraCapture({ onAnalysisComplete }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      // Send image to backend
      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        onAnalysisComplete(data); // Pass AI data up to parent
      } catch (error) {
        console.error("Error analyzing image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-6 drop-shadow">
        🍓 Snap Your Meal!
      </h2>
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
      {loading && <p className="text-orange-500 font-semibold">Analyzing image...</p>}
      {image && (
        <div className="flex flex-col items-center mt-4">
          <h3 className="text-xl font-bold text-orange-500 mb-2">Preview:</h3>
          <img
            src={image}
            alt="Captured"
            className="rounded-2xl border-4 border-pink-300 shadow-md w-72 h-72 object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
