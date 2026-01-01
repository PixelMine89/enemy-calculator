import { enemyUnits } from './data.js';

const raceSelect = document.getElementById('race');
const resultDiv = document.getElementById('result');

// Заполняем список рас
for (const race in enemyUnits) {
  const option = document.createElement('option');
  option.value = race;
  option.textContent = race;
  raceSelect.appendChild(option);
}

window.calculate = function () {
  const race = raceSelect.value;
  const targetPower = Number(document.getElementById('power').value);

  if (!targetPower || targetPower <= 0) {
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = 'Введите корректное значение мощи';
    return;
  }

  const units = enemyUnits[race];

  // DP: точная сборка мощности
  const dpMin = Array(targetPower + 1).fill(Infinity);
  const dpMax = Array(targetPower + 1).fill(-Infinity);

  dpMin[0] = 0;
  dpMax[0] = 0;

  for (let p = 1; p <= targetPower; p++) {
    for (const u of units) {
      if (p >= u.power && dpMin[p - u.power] !== Infinity) {
        dpMin[p] = Math.min(dpMin[p], dpMin[p - u.power] + u.defense);
        dpMax[p] = Math.max(dpMax[p], dpMax[p - u.power] + u.defense);
      }
    }
  }

  if (dpMin[targetPower] === Infinity) {
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML =
      'Невозможно собрать указанную мощь из доступных юнитов';
    return;
  }

  const minDef = dpMin[targetPower];
  const maxDef = dpMax[targetPower];

  // 🔥 ВЕРНУЛИ РАСЧЁТ АТАКИ
  const recommendedAttack = Math.ceil(maxDef * 95);

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = 
    <div>
      🛡 <b>Ожидаемая защита</b><br>
      ${minDef.toLocaleString()} – ${maxDef.toLocaleString()}
    </div>

    <br>

    <div>
      ⚔️ <b>Рекомендуемая атака</b><br>
      больше ${recommendedAttack.toLocaleString()}
    </div>

    <br>

    <div style="font-size:13px; opacity:0.75;">
      ℹ️ Диапазон защиты является <b>гарантированным минимумом и максимумом</b>,
      рассчитанным путём точной сборки отряда из реальных юнитов данной расы
      при заданной суммарной мощности.
    </div>
  ;
};
