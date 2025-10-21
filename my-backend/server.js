// === IMPORT MODULES ===
import express from "express";       // Web server
import cors from "cors";             // Allow requests from React
import dotenv from "dotenv";         // Load .env variables
import multer from "multer";         // Handle file uploads
import fetch from "node-fetch";      // Make external API calls
import fs from "fs";                 // Work with local files

dotenv.config(); // Load environment variables

// === APP SETUP ===
const app = express();
app.use(cors());
app.use(express.json());

// === FILE UPLOAD HANDLER ===
const upload = multer({ dest: "uploads/" }); // Temp folder for images

// === TEST ROUTE ===
app.get("/", (req, res) => {
  res.send("🍔 Calorie Counter AI Backend (Roboflow) is running ✅");
});

// === MAIN AI ROUTE ===
// The frontend will send an image file named 'image'
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path; // Temp path to uploaded image

    // === Send to Roboflow ===
    const modelUrl = process.env.MODEL_URL;
    const apiKey = process.env.ROBOFLOW_API_KEY;

    const response = await fetch(`${modelUrl}?api_key=${apiKey}`, {
      method: "POST",
      body: fs.createReadStream(imagePath),
    });

    const result = await response.json();

    // Delete the image after upload
    fs.unlinkSync(imagePath);

    // === Extract the top prediction (highest confidence) ===
    const predictions = result.predictions || [];
    const topPrediction = predictions.length > 0 ? predictions[0] : null;

    if (!topPrediction) {
      return res.json({ food: "Unknown", calories: "Unknown" });
    }

    const foodName = topPrediction.class || "Unknown";

    // === Calorie lookup database (can be expanded) ===
    const calorieDB = {
      banana: 105,
      apple: 95,
      rice: 200,
      bread: 80,
      orange: 62,
      pizza: 285,
      burger: 354,
      chicken: 239,
      fish: 206,
      fries: 365,
    };

    const calories = calorieDB[foodName.toLowerCase()] || "Unknown";

    // === Send the result to frontend ===
    res.json({
      food: foodName,
      confidence: (topPrediction.confidence * 100).toFixed(2) + "%",
      calories,
    });
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
