document.addEventListener("DOMContentLoaded", () => {
  const strip = document.getElementById("videoStrip");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!strip) return;

  // ====== Infinite Loop Setup (same idea) ======
  const original = strip.innerHTML;
  strip.insertAdjacentHTML("beforeend", original + original);
  let loopWidth = strip.scrollWidth / 2;
  let speed = 2.8; // marquee speed
  let paused = false;

  strip.classList.add("no-snap");

  function animate() {
    if (!paused) {
      strip.scrollLeft += speed;
      if (strip.scrollLeft >= loopWidth) strip.scrollLeft = 0;
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  const pause = () => (paused = true);
  const resume = () => (paused = false);

  strip.addEventListener("mouseenter", pause);
  strip.addEventListener("mouseleave", resume);
  window.addEventListener("resize", () => (loopWidth = strip.scrollWidth / 2));

  // ====== Arrow Controls (wrap-safe) ======
  const step = 324; // distance per click (card width + gap)
  prevBtn?.addEventListener("click", () => {
    pause();
    strip.scrollLeft -= step;
    if (strip.scrollLeft < 0) strip.scrollLeft += loopWidth;
    setTimeout(resume, 400);
  });
  nextBtn?.addEventListener("click", () => {
    pause();
    strip.scrollLeft += step;
    if (strip.scrollLeft >= loopWidth) strip.scrollLeft -= loopWidth;
    setTimeout(resume, 400);
  });

  // ====== Modal / Iframe Setup ======
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  const closeBtn = document.getElementById("closeVideo");

  function openModal(embedUrl) {
    try {
      const url = new URL(embedUrl, window.location.href);
      // Autoplay niceties
      if (!url.searchParams.has("autoplay"))
        url.searchParams.set("autoplay", "1");
      if (!url.searchParams.has("rel")) url.searchParams.set("rel", "0");
      frame.src = url.toString();
    } catch {
      frame.src = embedUrl; // if already a full URL
    }
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    pause(); // pause marquee while modal is open
  }

  function closeModal() {
    frame.src = ""; // stop playback
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    resume();
  }

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(); // overlay click
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // ====== Click handler on the strip (delegated) ======
  strip.addEventListener("click", (e) => {
    const btn = e.target.closest(".play-btn");
    if (!btn) return;

    // 1) Preferred: open iframe modal if data-embed is present
    const embed = btn.getAttribute("data-embed");
    if (embed) {
      openModal(embed);
      return;
    }

    // 2) Fallback: inline <video> play/pause (if you didn't add data-embed)
    const video = btn.previousElementSibling;
    if (!video || video.tagName.toLowerCase() !== "video") return;

    // Stop other inline videos
    strip.querySelectorAll("video").forEach((v) => {
      if (v !== video) {
        v.pause();
        v.currentTime = 0;
        const otherBtn = v.closest("article")?.querySelector(".play-btn");
        if (otherBtn) otherBtn.classList.remove("hidden");
      }
    });

    if (video.paused) {
      video.play().catch(() => {});
      btn.classList.add("hidden");
      pause();
    } else {
      video.pause();
      btn.classList.remove("hidden");
      resume();
    }

    video.onended = () => {
      btn.classList.remove("hidden");
      resume();
    };
  });
});
