/* DOM references -------------------------------------------------- */
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");
const groupsEl = document.getElementById("groups");
const groupBtn = document.getElementById("groupBtn");
const errorEl = document.getElementById("error");
const groupsBox = document.getElementById("groupsContainer");
const historyBox = document.getElementById("historyBox");

/* localStorage key & helpers ------------------------------------- */
const HISTORY_KEY = "numberDistributorHistory";

const loadHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
const saveHistory = (arr) =>
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));

let historyArr = loadHistory(); // in-memory copy for easy updates

/* UI helper: bingo-ball element ---------------------------------- */
const ballNode = (n) => {
  const span = document.createElement("span");
  span.className = "ball";
  span.textContent = n;
  return span;
};

/* Fisher–Yates shuffle ------------------------------------------- */
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* Input validation ------------------------------------------------ */
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
  return "";
};

/* Render the current distribution -------------------------------- */
const renderCurrent = (result) => {
  groupsBox.innerHTML = ""; // clear previous

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
};

/* Render history (last 10) --------------------------------------- */
const renderHistory = () => {
  historyBox.innerHTML = "";

  historyArr.forEach((dist, idx) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `${idx + 1}. ${dist.time} (range ${dist.from}-${
      dist.to
    }, ${dist.groups} groups)`;
    details.appendChild(summary);

    dist.data.forEach((arr, i) => {
      const wrapper = document.createElement("div");
      wrapper.className = "group";

      const header = document.createElement("div");
      header.className = "group-header";
      header.textContent = `G${i + 1} (${arr.length})`;
      wrapper.appendChild(header);

      const memberBox = document.createElement("div");
      memberBox.className = "group-members";
      arr.forEach((n) => memberBox.appendChild(ballNode(n)));
      wrapper.appendChild(memberBox);

      details.appendChild(wrapper);
    });

    historyBox.appendChild(details);
  });
};

/* Main “Divide into Groups” action -------------------------------- */
groupBtn.addEventListener("click", () => {
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

  /* create shuffled list of numbers -------------------------------- */
  const numbers = shuffle(Array.from({ length: total }, (_, i) => from + i));

  /* base size + extras logic --------------------------------------- */
  const baseSize = Math.floor(total / groups);
  const extras = total % groups;
  const extraTargets = shuffle([...Array(groups).keys()]).slice(0, extras);

  const result = Array.from({ length: groups }, () => []);
  let idx = 0;

  numbers.forEach((num) => {
    result[idx].push(num);
    const targetSize = baseSize + (extraTargets.includes(idx) ? 1 : 0);
    if (result[idx].length === targetSize) idx++;
  });

  /* 1) render current result --------------------------------------- */
  renderCurrent(result);

  /* 2) update & render history ------------------------------------- */
  const timestamp = new Date().toLocaleString();
  historyArr.unshift({ time: timestamp, from, to, groups, data: result });
  if (historyArr.length > 10) historyArr.pop(); // keep only 10
  saveHistory(historyArr);
  renderHistory();
});

/* initial paint of history on page load --------------------------- */
renderHistory();
