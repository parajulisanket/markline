(function () {
  const perPage = 3;
  const container = document.getElementById("posts");
  const items = Array.from(container.querySelectorAll(".post-row"));
  const pager = document.getElementById("pagination");
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  let current = 1;

  const url = new URL(window.location);
  const qp = Number(url.searchParams.get("page"));
  if (qp >= 1 && qp <= totalPages) current = qp;

  function updateURL(p) {
    const u = new URL(window.location);
    u.searchParams.set("page", p);
    history.replaceState(null, "", u);
  }

  function showPage(p) {
    items.forEach((el, i) => {
      const pageIndex = Math.floor(i / perPage) + 1;
      el.classList.toggle("hidden", pageIndex !== p);
    });

    // Update active styling
    pager.querySelectorAll("[data-page]").forEach((btn) => {
      const isActive = Number(btn.dataset.page) === p;
      btn.classList.toggle("bg-slate-100", isActive);
      btn.classList.toggle("shadow-inner", isActive);
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });

    // Disable chevrons at ends
    pager
      .querySelector('[data-nav="prev"]')
      ?.toggleAttribute("disabled", p === 1);
    pager
      .querySelector('[data-nav="next"]')
      ?.toggleAttribute("disabled", p === totalPages);

    updateURL(p);
  }

  function buildPager() {
    pager.innerHTML = "";

    const makeBtn = (label, cls, attrs = {}) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.className = cls;
      Object.entries(attrs).forEach(([k, v]) => b.setAttribute(k, v));
      return b;
    };

    const prev = makeBtn(
      `<i class="fa fa-chevron-left"></i>`,
      "h-9 w-9 grid place-items-center text-sm text-gray-700 hover:text-black disabled:opacity-30",
      { "data-nav": "prev", "aria-label": "Previous page" }
    );
    prev.innerHTML = `<i class="fa fa-chevron-left"></i>`;

    prev.addEventListener("click", () => {
      current = Math.max(1, current - 1);
      showPage(current);
    });
    pager.appendChild(prev);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const btn = makeBtn(
        String(i),

        "h-8 w-8 grid place-items-center rounded-full text-sm text-gray-900 hover:bg-slate-100 transition",
        { "data-page": i, "aria-label": `Page ${i}` }
      );
      btn.addEventListener("click", () => {
        current = i;
        showPage(current);
      });
      pager.appendChild(btn);
    }

    const next = makeBtn(
      `<i class="fa fa-chevron-right"></i>`,
      "h-9 w-9 grid place-items-center text-sm text-gray-700 hover:text-black disabled:opacity-30",
      { "data-nav": "next", "aria-label": "Next page" }
    );
    next.innerHTML = `<i class="fa fa-chevron-right"></i>`;
    next.addEventListener("click", () => {
      current = Math.min(totalPages, current + 1);
      showPage(current);
    });
    pager.appendChild(next);
  }

  buildPager();
  showPage(current);
})();
