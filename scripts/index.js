// scrolling
const strip = document.getElementById("videoStrip");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const cardWidth = 260 + 24;

if (prevBtn && strip) {
  prevBtn.addEventListener("click", () => {
    strip.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });
}

if (nextBtn && strip) {
  nextBtn.addEventListener("click", () => {
    strip.scrollBy({ left: cardWidth, behavior: "smooth" });
  });
}

// --- Video Play Logic ---
const playButtons = document.querySelectorAll(".play-btn");

playButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const video = btn.previousElementSibling;

    document.querySelectorAll("#videoStrip video").forEach((v) => {
      if (v !== video) {
        v.pause();
        v.currentTime = 0;
        const otherBtn = v.closest("article")?.querySelector(".play-btn");
        if (otherBtn) otherBtn.classList.remove("hidden");
      }
    });

    // Toggle current video
    if (video.paused) {
      video.play();
      btn.classList.add("hidden");
    } else {
      video.pause();
      btn.classList.remove("hidden");
    }

    video.onended = () => {
      btn.classList.remove("hidden");
    };
  });
});

// faq js code

document.querySelectorAll(".faq-arrow").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const panel = item.querySelector(".faq-panel");
    const isOpen = item.classList.contains("open");

    if (isOpen) {
      // collapse
      panel.style.maxHeight = panel.scrollHeight + "px"; // set current height first
      requestAnimationFrame(() => {
        panel.style.maxHeight = "0px";
      });
      item.classList.remove("open");
      btn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
      btn.setAttribute("aria-expanded", "false");
    } else {
      // expand
      item.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
      btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// On load: set open panels to their natural height
document.querySelectorAll(".faq-item.open .faq-panel").forEach((panel) => {
  panel.style.maxHeight = panel.scrollHeight + "px";
});

// back to top logic code
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= docHeight) {
    backToTopButton.classList.remove("hidden");
  } else {
    backToTopButton.classList.add("hidden");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// accordion for study destination page

document.addEventListener("DOMContentLoaded", () => {
  const accRoot = document.getElementById("app-accordion");

  accRoot.addEventListener("click", (e) => {
    const btn = e.target.closest(".acc-toggle");
    if (!btn || !accRoot.contains(btn)) return;

    const targetSel = btn.dataset.target;
    const panel = accRoot.querySelector(targetSel);
    const icon = btn.querySelector(".acc-chevron");
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    if (!panel) return;

    // 1) Close everything else first
    accRoot
      .querySelectorAll('.acc-toggle[aria-expanded="true"]')
      .forEach((openBtn) => {
        if (openBtn === btn) return;
        const p = accRoot.querySelector(openBtn.dataset.target);
        if (p) p.style.maxHeight = "0px";
        openBtn.setAttribute("aria-expanded", "false");
        openBtn.querySelector(".acc-chevron")?.classList.remove("rotate-90");
      });

    // 2) Toggle the clicked one
    if (isOpen) {
      btn.setAttribute("aria-expanded", "false");
      panel.style.maxHeight = "0px";
      icon?.classList.remove("rotate-90"); // arrow points right
    } else {
      btn.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = panel.scrollHeight + "px";
      icon?.classList.add("rotate-90"); // arrow rotates down
    }
  });

  // keep open panel height correct on resize
  window.addEventListener("resize", () => {
    accRoot
      .querySelectorAll('.acc-toggle[aria-expanded="true"]')
      .forEach((btn) => {
        const p = accRoot.querySelector(btn.dataset.target);
        if (p) p.style.maxHeight = p.scrollHeight + "px";
      });
  });
});

// hero section animation
(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const START_DELAY_MS = 120;

  function play() {
    const left = document.getElementById("heroLeft");
    const right = document.getElementById("heroRight");
    if (!left || !right) return;

    if (reduceMotion) {
      left.classList.remove("enter-init");
      right.classList.remove("enter-init");
      return;
    }

    // ensure initial hidden state applied
    left.classList.add("enter-init");
    right.classList.add("enter-init");

    // kick both at the exact same time
    setTimeout(() => {
      left.classList.remove("enter-init");
      right.classList.remove("enter-init");
      left.classList.add("in-up");
      right.classList.add("in-down");
    }, START_DELAY_MS);
  }

  window.addEventListener("DOMContentLoaded", play);
  // handle back/forward cache restores too
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) play();
  });
})();

// footer scroll up
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("footerSection");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.remove("opacity-0", "translate-y-10");
          footer.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(footer);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(footer);
});
