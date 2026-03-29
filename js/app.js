// Nutrilens basic logic + AI

const fileInput = document.querySelector('input[type="file"]');
const preview = document.querySelector('#preview');
const results = document.querySelector('#results');

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      runAI(ev);
    };
    reader.readAsDataURL(file);
  });
}

// --- AI PART ---

async function analyzeFood(imageBase64) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/nateraw/food-image-classification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // If later you create a free HF token, add:
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: JSON.stringify({ inputs: imageBase64 })
    }
  );

  const result = await response.json();
  return result[0]; // top prediction
}

function estimateCalories(foodName) {
  const calories = {
    'pizza': 266,
    'burger': 295,
    'fried rice': 250,
    'ice cream': 207,
    'donut': 452,
    'grilled chicken': 165,
    'salad': 152,
    'pasta': 350,
    'sushi': 200,
    'steak': 271
  };

  foodName = foodName.toLowerCase();
  return calories[foodName] || 300; // fallback average
}

async function runAI(ev) {
  const base64 = ev.target.result;

  if (preview) {
    preview.src = base64;
    preview.style.display = 'block';
  }

  if (results) {
    results.innerHTML = '<p>Analyzing food… please wait.</p>';
  }

  try {
    const prediction = await analyzeFood(base64);
    const foodName = prediction.label;
    const calorieEstimate = estimateCalories(foodName);

    if (results) {
      results.innerHTML = `
        <h3>AI Nutrition Analysis</h3>
        <p><strong>Food:</strong> ${foodName}</p>
        <p><strong>Estimated Calories:</strong> ${calorieEstimate} kcal</p>
        <p><strong>Confidence:</strong> ${(prediction.score * 100).toFixed(1)}%</p>
      `;
    }
  } catch (err) {
    if (results) {
      results.innerHTML = `
        <p>Sorry, something went wrong while analyzing the image.</p>
      `;
    }
    console.error(err);
  }
}
