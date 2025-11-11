import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    const modelUrl = process.env.MODEL_URL;
    const apiKey = process.env.ROBOFLOW_API_KEY;
    if (!modelUrl || !apiKey) {
      console.error('Model URL or API key not found in .env');
      process.exit(1);
    }

    const filePath = 'test-image.png';
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=','base64'));
    }

    const url = `${modelUrl}?api_key=${apiKey}`;
  // Send binary with explicit content-type (Roboflow expects proper Content-Type)
  const res = await fetch(url, { method: 'POST', body: fs.createReadStream(filePath), headers: { 'Content-Type': 'image/png' } });
    const json = await res.json();
    console.log('Roboflow response sample:', JSON.stringify(json, null, 2));

    const predictions = json.predictions || [];
    predictions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    const top = predictions[0] || null;

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

    if (!top) {
      console.log('No predictions from model. Returning Unknown.');
      console.log(JSON.stringify({ foodName: 'Unknown', confidence: null, calories: null, protein: null, carbs: null, fat: null }));
      process.exit(0);
    }

    const foodName = (top.class || 'Unknown').toLowerCase();
    const nutrition = localDB[foodName] || { calories: null, protein: null, carbs: null, fat: null };

    const output = {
      foodName: top.class || 'Unknown',
      confidence: typeof top.confidence === 'number' ? (top.confidence * 100).toFixed(2) + '%' : null,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      rawLabels: predictions.map(p => ({ label: p.class, confidence: p.confidence }))
    };

    console.log('Mapped output:', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('Error calling Roboflow:', err);
    process.exit(1);
  }
})();
