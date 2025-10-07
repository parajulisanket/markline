document.addEventListener("DOMContentLoaded", () => {
  const strip = document.getElementById("videoStrip");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!strip) return;

  // Duplicate content twice for perfect infinite loop
  const original = strip.innerHTML;
  strip.insertAdjacentHTML("beforeend", original + original);

  let loopWidth = strip.scrollWidth / 2;
  let speed = 2.8; // adjust flow speed
  let paused = false;

  strip.classList.add("no-snap");

  // Smooth infinite loop
  function animate() {
    if (!paused) {
      strip.scrollLeft += speed;
      if (strip.scrollLeft >= loopWidth) {
        strip.scrollLeft = 0;
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Pause/resume handlers
  const pause = () => (paused = true);
  const resume = () => (paused = false);

  // Pause when hovering only inside carousel area
  strip.addEventListener("mouseenter", pause);
  strip.addEventListener("mouseleave", resume);

  // Recalculate on resize
  window.addEventListener("resize", () => (loopWidth = strip.scrollWidth / 2));

  // === Manual Arrow Controls ===
  const step = 324; // distance per click
  prevBtn?.addEventListener("click", () => {
    pause();
    strip.scrollLeft -= step;
    if (strip.scrollLeft < 0) strip.scrollLeft += loopWidth;
    setTimeout(resume, 400); // resume after short delay
  });

  nextBtn?.addEventListener("click", () => {
    pause();
    strip.scrollLeft += step;
    if (strip.scrollLeft >= loopWidth) strip.scrollLeft -= loopWidth;
    setTimeout(resume, 400);
  });

  // === Video Play Logic ===
  strip.addEventListener("click", (e) => {
    const btn = e.target.closest(".play-btn");
    if (!btn) return;

    const video = btn.previousElementSibling;
    if (!video) return;

    // Stop all other videos
    strip.querySelectorAll("video").forEach((v) => {
      if (v !== video) {
        v.pause();
        v.currentTime = 0;
        const otherBtn = v.closest("article")?.querySelector(".play-btn");
        if (otherBtn) otherBtn.classList.remove("hidden");
      }
    });

    // Toggle current video
    if (video.paused) {
      video.play().catch(() => {});
      btn.classList.add("hidden");
      pause(); // stop marquee while playing
    } else {
      video.pause();
      btn.classList.remove("hidden");
      resume(); // resume marquee
    }

    // Resume when video ends
    video.onended = () => {
      btn.classList.remove("hidden");
      resume();
    };
  });
});
