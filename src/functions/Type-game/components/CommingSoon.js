export class ComingSoonBlocker {
  constructor(el) {
    this.el = el;
    this.status = el.dataset.status;

    if (this.status === "coming") {
      this.disableWithOverlay();
    }
  }

  disableWithOverlay() {
    this.el.disabled = true;
    this.el.style.position = "relative";

    // Overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>`;
    //Position

    overlay.style.position = "absolute";
    overlay.style.top = "-8px";
    overlay.style.left = "-8px";
    overlay.style.zIndex = 888;
    overlay.style.color = "#2C506D";
    overlay.style.border = "1px solid #2C506D";
    overlay.style.boxShadow = "2px 2px 0px #2C506D";
    overlay.style.backgroundColor = "#EFEEDC";
    overlay.style.borderRadius = "50%";
    overlay.style.padding = "5px";

    this.el.appendChild(overlay);
  }
}

// Applique à tous les éléments "coming"
document.querySelectorAll("[data-status='coming']").forEach((el) => {
  new ComingSoonBlocker(el);
});
