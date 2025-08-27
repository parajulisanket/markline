document.addEventListener("DOMContentLoaded", () => {
  /**
   * Generic dropdown/mega-menu setup
   * @param {Object} cfg
   * @param {string} cfg.arrowId
   * @param {string} cfg.chevronId
   * @param {string} cfg.panelId
   * @param {string[]} cfg.showClasses - classes to apply when open
   * @param {string[]} cfg.hideClasses - classes to apply when closed
   * @param {string} [cfg.tabsSelector] - optional tabs selector
   * @param {string} [cfg.panelsSelector] - optional panels selector
   * @param {string} [cfg.activeClass=''] - class for active tab color
   * @param {string} [cfg.inactiveClass=''] - class for inactive tab color
   */
  function setupMenu(cfg) {
    const arrow = document.getElementById(cfg.arrowId);
    const chevron = document.getElementById(cfg.chevronId);
    const panel = document.getElementById(cfg.panelId);

    if (!arrow || !chevron || !panel) return; 

    const show = () => {
      panel.classList.remove(...cfg.hideClasses);
      panel.classList.add(...cfg.showClasses);
      chevron.classList.add("rotate-180");
    };
    const hide = () => {
      panel.classList.add(...cfg.hideClasses);
      panel.classList.remove(...cfg.showClasses);
      chevron.classList.remove("rotate-180");
    };
    const isOpen = () => panel.classList.contains("pointer-events-auto");

    arrow.addEventListener("click", (e) => {
      e.preventDefault();
      isOpen() ? hide() : show();
    });

    // Tabs (optional)
    if (cfg.tabsSelector && cfg.panelsSelector) {
      const tabs = document.querySelectorAll(cfg.tabsSelector);
      const panels = document.querySelectorAll(cfg.panelsSelector);
      tabs.forEach((btn) => {
        btn.addEventListener("click", () => {
          tabs.forEach((b) => {
            b.classList.remove("active");
            if (cfg.activeClass) b.classList.remove(cfg.activeClass);
            if (cfg.inactiveClass) b.classList.add(cfg.inactiveClass);
          });
          btn.classList.add("active");
          if (cfg.inactiveClass) btn.classList.remove(cfg.inactiveClass);
          if (cfg.activeClass) btn.classList.add(cfg.activeClass);

          const id = btn.getAttribute("data-tab");
          panels.forEach((p) =>
            p.classList.toggle("hidden", p.getAttribute("data-panel") !== id)
          );
          show(); 
        });
      });
    }

    // Close on outside click / ESC
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !arrow.contains(e.target)) hide();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hide();
    });
  }

  // SERVICES mega menu
  setupMenu({
    arrowId: "svcArrow",
    chevronId: "svcChevron",
    panelId: "svcMega",
    showClasses: ["opacity-100", "pointer-events-auto", "scale-100"],
    hideClasses: ["opacity-0", "pointer-events-none", "scale-95"],
    tabsSelector: "#svcTabs .svc-tab",
    panelsSelector: "#svcPanels .svc-panel",
    activeClass: "text-[#1e549f]",
    inactiveClass: "text-gray-800",
  });

  // STUDY DESTINATIONS dropdown
  setupMenu({
    arrowId: "destArrow",
    chevronId: "destChevron",
    panelId: "destMenu",
    showClasses: ["opacity-100", "pointer-events-auto", "translate-y-0"],
    hideClasses: ["opacity-0", "pointer-events-none", "translate-y-1"],
    // no tabs/panels here
  });

  // EVENTS  mega menu
  setupMenu({
    arrowId: "eventsArrow",
    chevronId: "eventsChevron",
    panelId: "eventsMega",
    showClasses: ["opacity-100", "pointer-events-auto", "translate-y-0"],
    hideClasses: ["opacity-0", "pointer-events-none", "translate-y-1"],
    tabsSelector: "#eventsTabs .evt-tab",
    panelsSelector: "#eventsPanels .evt-panel",
    activeClass: "text-[#1e549f]",
    inactiveClass: "text-gray-800",
  });
});
