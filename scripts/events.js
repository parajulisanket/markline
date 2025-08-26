document.addEventListener("DOMContentLoaded", () => {
  const tablist = document.getElementById("tablist");
  const indicator = document.getElementById("tab-indicator");
  const buttons = Array.from(tablist.querySelectorAll(".tab-btn"));

  function moveIndicator(btn) {
    const { left } = tablist.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    indicator.style.width = `${b.width}px`;
    indicator.style.left = `${b.left - left}px`;
  }

  function activate(btn) {
    // update buttons
    buttons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.classList.toggle("text-[#1e549f]", active);
      b.classList.toggle("font-medium", active);
      b.classList.toggle("text-slate-700", !active);
      b.setAttribute("aria-selected", String(active));

      // toggle panels
      const panel = document.querySelector(b.dataset.target);
      if (panel) panel.classList.toggle("hidden", !active);
    });

    moveIndicator(btn);
  }

  // clicks
  tablist.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    activate(btn);
  });

  // initial position (after layout)
  requestAnimationFrame(() => {
    const current = tablist.querySelector(".tab-btn.active") || buttons[0];
    activate(current);
  });

  // keep indicator aligned on resize
  window.addEventListener("resize", () => {
    const current = tablist.querySelector(".tab-btn.active");
    if (current) moveIndicator(current);
  });
});
