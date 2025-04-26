// --- DOM references -------------------------------------------------
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");
const groupsEl = document.getElementById("groups");
const groupBtn = document.getElementById("groupBtn");
const errorEl = document.getElementById("error");
const groupsBox = document.getElementById("groupsContainer");

// --- helpers --------------------------------------------------------
const ballNode = (n) => {
  const span = document.createElement("span");
  span.className = "ball";
  span.textContent = n;
  return span;
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const validateInputs = () => {
  const from = +fromEl.value;
  const to = +toEl.value;
  const groups = +groupsEl.value;

  if (isNaN(from) || isNaN(to) || from > to) {
    return "Range must be valid and ‘From’ ≤ ‘To’.";
  }
  const total = to - from + 1;
  if (groups < 1 || groups > total) {
    return "Groups must be between 1 and the total numbers in range.";
  }
  return ""; // no error
};

// --- main action ----------------------------------------------------
groupBtn.addEventListener("click", () => {
  groupsBox.innerHTML = "";

  const err = validateInputs();
  if (err) {
    errorEl.textContent = err;
    return;
  }
  errorEl.textContent = "";

  const from = +fromEl.value;
  const to = +toEl.value;
  const groups = +groupsEl.value;
  const total = to - from + 1;

  // full shuffled list of numbers
  const numbers = shuffle(Array.from({ length: total }, (_, i) => from + i));

  // base size and “extras” to distribute
  const baseSize = Math.floor(total / groups);
  const extras = total % groups;

  // randomly pick which groups get the extra member
  const extraTargets = shuffle([...Array(groups).keys()]).slice(0, extras);

  // build result array of groups
  const result = Array.from({ length: groups }, () => []);
  let idx = 0;

  numbers.forEach((num) => {
    result[idx].push(num);
    const targetSize = baseSize + (extraTargets.includes(idx) ? 1 : 0);
    if (result[idx].length === targetSize) idx++;
  });

  // render groups
  result.forEach((arr, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "group";

    const header = document.createElement("div");
    header.className = "group-header";
    header.textContent = `Group ${i + 1} (${arr.length})`;
    wrapper.appendChild(header);

    const memberBox = document.createElement("div");
    memberBox.className = "group-members";
    arr.forEach((n) => memberBox.appendChild(ballNode(n)));
    wrapper.appendChild(memberBox);

    groupsBox.appendChild(wrapper);
  });
});
