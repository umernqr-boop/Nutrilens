// Nutrilens basic logic

const fileInput = document.querySelector('input[type="file"]');
const preview = document.querySelector('#preview');
const results = document.querySelector('#results');

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (preview) {
        preview.src = ev.target.result;
        preview.style.display = 'block';
      }
      mockAnalyze();
    };
    reader.readAsDataURL(file);
  });
}

function mockAnalyze() {
  const mock = {
    item: 'Grilled Chicken with Rice',
    calories: 520,
    protein: 38,
    carbs: 45,
    fats: 18
  };

  if (!results) return;

  results.innerHTML = `
    <h3>Estimated Nutrition</h3>
    <p><strong>Item:</strong> ${mock.item}</p>
    <p><strong>Calories:</strong> ${mock.calories} kcal</p>
    <p><strong>Protein:</strong> ${mock.protein} g</p>
    <p><strong>Carbs:</strong> ${mock.carbs} g</p>
    <p><strong>Fats:</strong> ${mock.fats} g</p>
  `;
}

