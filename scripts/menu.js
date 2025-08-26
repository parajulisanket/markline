// Theme menu toggle
const themeBtn = document.getElementById("themeBtn");
const themeMenu = document.getElementById("themeMenu");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const open = themeMenu.classList.contains("opacity-100");
    themeMenu.classList.toggle("opacity-100", !open);
    themeMenu.classList.toggle("pointer-events-auto", !open);
    themeMenu.classList.toggle("translate-y-0", !open);
  });
  document.addEventListener("click", (e) => {
    if (!themeMenu.contains(e.target) && !themeBtn.contains(e.target)) {
      themeMenu.classList.remove(
        "opacity-100",
        "pointer-events-auto",
        "translate-y-0"
      );
    }
  });
}

// Mobile menus
const mobileToggle = document.getElementById("mobileToggle");
const mainNavToggle = document.getElementById("mainNavToggle");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMobile() {
  mobileMenu.classList.toggle("hidden");
}

if (mobileToggle) mobileToggle.addEventListener("click", toggleMobile);
if (mainNavToggle) mainNavToggle.addEventListener("click", toggleMobile);
