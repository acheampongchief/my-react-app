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
// Limit uploads to images only and reasonable file size (5MB)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file && file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image uploads are allowed"));
  },
}); // Temp folder for images

// === TEST ROUTE ===
app.get("/", (req, res) => {
  res.send("🍔 Calorie Counter AI Backend (Roboflow) is running ✅");
});

// === MAIN AI ROUTE ===
// The frontend will send an image file named 'image'
// Shared handler to keep logic in one place. Responds with a structured nutrition object.
const analyzeHandler = async (req, res) => {
  let imagePath;
  try {
    if (!req.file) return res.status(400).json({ error: "No image file provided" });
    imagePath = req.file.path; // Temp path to uploaded image

    // === Send to the configured vision/model endpoint (e.g., Roboflow) ===
    const modelUrl = process.env.MODEL_URL;
    const apiKey = process.env.ROBOFLOW_API_KEY;

    if (!modelUrl || !apiKey) {
      console.warn("Model URL or API key not configured. Returning placeholder response.");
      // Fallback: try to infer from filename or return unknown
      await fs.promises.unlink(imagePath).catch(() => {});
      return res.json({
        foodName: "Unknown",
        confidence: null,
        calories: null,
        protein: null,
        carbs: null,
        fat: null,
        rawLabels: [],
        note: "Vision/model not configured on server (no MODEL_URL/ROBOFLOW_API_KEY).",
      });
    }

    const response = await fetch(`${modelUrl}?api_key=${apiKey}`, {
      method: "POST",
      body: fs.createReadStream(imagePath),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Vision API error: ${response.status} ${text}`);
    }

    const result = await response.json();

    // Ensure we delete the temp image file
    await fs.promises.unlink(imagePath).catch(() => {});

    // === Extract predictions and top prediction ===
    const predictions = result.predictions || [];
    // Sort by confidence descending just in case
    predictions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    const topPrediction = predictions.length > 0 ? predictions[0] : null;

    if (!topPrediction) {
      return res.json({
        foodName: "Unknown",
        confidence: null,
        calories: null,
        protein: null,
        carbs: null,
        fat: null,
        rawLabels: predictions.map((p) => p.class || null).filter(Boolean),
      });
    }

    const foodName = (topPrediction.class || "Unknown").toLowerCase();

    // === Nutrition lookup: try external nutrition API if configured, else fallback to local DB ===
    const lookupNutrition = async (name) => {
      // Basic normalization: remove trailing plural 's' (very naive), trim
      let normalized = name.trim().toLowerCase();
      if (normalized.endsWith('s')) normalized = normalized.slice(0, -1);

      // Local fallback database
      const localDB = {
        banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
        apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        rice: { calories: 206, protein: 4.2, carbs: 45, fat: 0.4 },
        bread: { calories: 79, protein: 4.0, carbs: 15, fat: 1.0 },
        orange: { calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },
        pizza: { calories: 285, protein: 12.0, carbs: 36.0, fat: 10.0 },
        burger: { calories: 354, protein: 17.0, carbs: 29.0, fat: 19.0 },
        chicken: { calories: 239, protein: 27.0, carbs: 0.0, fat: 14.0 },
        fish: { calories: 206, protein: 22.0, carbs: 0.0, fat: 12.0 },
        fries: { calories: 365, protein: 3.4, carbs: 49.0, fat: 17.0 },
      };

      if (process.env.NUTRITIONIX_APP_ID && process.env.NUTRITIONIX_API_KEY) {
        // If you configure Nutritionix credentials in .env, call the real API here.
        // This code uses fetch and environment variables; no keys are logged or returned.
        try {
          const nxResp = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'x-app-id': process.env.NUTRITIONIX_APP_ID,
              'x-app-key': process.env.NUTRITIONIX_API_KEY,
            },
            body: JSON.stringify({ query: normalized }),
          });

          if (nxResp.ok) {
            const nxJson = await nxResp.json();
            const first = (nxJson && nxJson.foods && nxJson.foods[0]) || null;
            if (first) {
              return {
                calories: first.nf_calories || null,
                protein: first.nf_protein || null,
                carbs: first.nf_total_carbohydrate || null,
                fat: first.nf_total_fat || null,
              };
            }
          }
        } catch (err) {
          console.warn('Nutritionix lookup failed, falling back to local DB');
        }
      }

      return localDB[normalized] || { calories: null, protein: null, carbs: null, fat: null };
    };

    const nutrition = await lookupNutrition(foodName);

    return res.json({
      foodName: topPrediction.class || 'Unknown',
      confidence: typeof topPrediction.confidence === 'number' ? (topPrediction.confidence * 100).toFixed(2) + '%' : null,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      rawLabels: predictions.map((p) => ({ label: p.class, confidence: p.confidence })),
    });
  } catch (error) {
    console.error('❌ Error analyzing image:', error.message || error);
    // Try to clean up the temp file if still present
    if (imagePath) await fs.promises.unlink(imagePath).catch(() => {});
    return res.status(500).json({ error: 'Failed to analyze image' });
  }
};

// New recommended endpoint per app conventions
app.post('/api/analyze-photo', upload.single('image'), analyzeHandler);
// Backwards-compatible alias
app.post('/analyze', upload.single('image'), analyzeHandler);

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
