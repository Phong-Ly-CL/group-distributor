let remaining = [];
const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");
const rollBtn = document.getElementById("roll");
const startBtn = document.getElementById("start");
const minInput = document.getElementById("min");
const maxInput = document.getElementById("max");
const errorEl = document.getElementById("error");

function initGame() {
  const min = parseInt(minInput.value, 10);
  const max = parseInt(maxInput.value, 10);

  // Clear previous error message
  errorEl.textContent = "";

  // Validate range: allow same number (single-value range)
  if (isNaN(min) || isNaN(max) || min > max) {
    errorEl.textContent =
      'Please enter a valid range where "From" is less than or equal to "To".';
    rollBtn.disabled = true;
    return;
  }

  // Build the list of numbers inclusively
  remaining = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  // Reset UI state
  currentEl.textContent = "";
  historyEl.innerHTML = "";
  rollBtn.disabled = false;
  rollBtn.textContent = "Roll Next Number";
}

function rollNumber() {
  if (!remaining.length) return;

  const index = Math.floor(Math.random() * remaining.length);
  const number = remaining.splice(index, 1)[0];

  currentEl.textContent = number;
  addToHistory(number);

  if (!remaining.length) {
    rollBtn.disabled = true;
    rollBtn.textContent = "All numbers rolled";
  }
}

function addToHistory(num) {
  const ball = document.createElement("div");
  ball.className = "ball";
  ball.textContent = num;
  historyEl.appendChild(ball);
}

// Event listeners
startBtn.addEventListener("click", initGame);
rollBtn.addEventListener("click", rollNumber);
