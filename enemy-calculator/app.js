import { enemyData } from './data.js';

const raceSelect = document.getElementById('race');
const resultDiv = document.getElementById('result');

// Заполняем список рас
for (const race in enemyData) {
  const option = document.createElement('option');
  option.value = race;
  option.textContent = race;
  raceSelect.appendChild(option);
}

// Логарифмическая регрессия
function regression(points) {
  let n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (const p of points) {
    const x = Math.log(p.power);
    const y = Math.log(p.defense);

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const a = (sumY - b * sumX) / n;

  return { A: Math.exp(a), B: b };
}

// Основной расчёт
window.calculate = function () {
  const race = raceSelect.value;
  const power = Number(document.getElementById('power').value);

  if (!power || power <= 0) {
    resultDiv.textContent = 'Введите корректную мощь';
    return;
  }

  const data = enemyData[race];

  const model = regression(data);

  let minError = Infinity;
  let maxError = -Infinity;

  for (const p of data) {
    const predicted = model.A * Math.pow(p.power, model.B);
    const error = p.defense / predicted;

    minError = Math.min(minError, error);
    maxError = Math.max(maxError, error);
  }

  const base = model.A * Math.pow(power, model.B);

  const minDef = Math.round(base * minError);
  const maxDef = Math.round(base * maxError);

  resultDiv.innerHTML = `
    Ожидаемая защита:<br>
    <b>${minDef.toLocaleString()} – ${maxDef.toLocaleString()}</b>
  `;
};