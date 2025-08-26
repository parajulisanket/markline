const fmtNepNum = new Intl.NumberFormat("ne-NP");
const fmtNepDate = new Intl.DateTimeFormat("ne-NP", {
  year: "numeric",
  month: "long",
});
const fmtNepWeekday = new Intl.DateTimeFormat("ne-NP", {
  weekday: "long",
});

// Populate selects
(function initSelectors() {
  const yearSel = document.getElementById("year");
  const monthSel = document.getElementById("month");
  const daySel = document.getElementById("day");

  const now = new Date();

  for (let y = 2005; y <= 2050; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }
  yearSel.value = now.getFullYear();

  const months = new Intl.DateTimeFormat("en", { month: "long" });
  for (let m = 0; m < 12; m++) {
    const d = new Date(2000, m, 1);
    const opt = document.createElement("option");
    opt.value = m + 1;
    opt.textContent = months.format(d);
    monthSel.appendChild(opt);
  }
  monthSel.value = now.getMonth() + 1;

  function fillDays(y, m) {
    daySel.innerHTML = "";
    const last = new Date(y, m, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      daySel.appendChild(opt);
    }
  }

  fillDays(now.getFullYear(), now.getMonth() + 1);
  daySel.value = now.getDate();

  // Refill on change
  yearSel.addEventListener("change", () => {
    fillDays(+yearSel.value, +monthSel.value);
    // clamp if needed
    if (+daySel.value > daySel.options.length)
      daySel.value = daySel.options.length;
  });
  monthSel.addEventListener("change", () => {
    fillDays(+yearSel.value, +monthSel.value);
    if (+daySel.value > daySel.options.length)
      daySel.value = daySel.options.length;
  });

  // Show current date immediately
  updateOutput(new Date());
})();

// Stub conversion (replace with real AD↔BS if you add a library)
function convertDate(calType, y, m, d) {
  const date = new Date(y, m - 1, d);

  if (calType === "AD_to_AD") {
    return date;
  }

  // NOTE: Proper BS conversion needs a dedicated algorithm/library.
  // For now, we *display* in Nepali locale while keeping the same Gregorian date
  // so the UI matches your screenshot. Replace this with real conversion later.
  return date;
}

function updateOutput(dateObj) {
  document.getElementById("convertedText").textContent =
    fmtNepDate.format(dateObj);

  const weekdayName = fmtNepWeekday.format(dateObj);
  const weekdayNum = ((dateObj.getDay() + 6) % 7) + 1;
  document.getElementById("weekdayName").textContent = weekdayName;
  document.getElementById("weekdayNum").textContent =
    fmtNepNum.format(weekdayNum);
}

document.getElementById("dateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const calType = document.getElementById("calType").value;
  const y = +document.getElementById("year").value;
  const m = +document.getElementById("month").value;
  const d = +document.getElementById("day").value;

  const resultDate = convertDate(calType, y, m, d);
  updateOutput(resultDate);
});
