/**
 * Shared Mermaid bootstrap for docs pages.
 * Usage: <script type="module" src="/scripts/mermaid-init.js"></script>
 * Wrap diagrams in <div class="mermaid-wrap"><pre class="mermaid">...</pre></div>
 * Add class mermaid-compact for a small click-to-zoom preview.
 */
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10.7.0/dist/mermaid.esm.min.mjs";

mermaid.initialize({
  startOnLoad: false,
  sequence: {
    useMaxWidth: false,
    actorMargin: 60,
    messageMargin: 40,
    boxMargin: 12,
    messageFontSize: "16px",
    actorFontSize: "16px",
    noteFontSize: "15px",
    messageAlign: "left",
  },
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    nodeSpacing: 50,
    rankSpacing: 60,
    padding: 16,
  },
  themeVariables: {
    fontSize: "16px",
    fontFamily: "Segoe UI, system-ui, sans-serif",
  },
});

await mermaid.run({ querySelector: ".mermaid" });

setupMermaidZoom();

function setupMermaidZoom() {
  let activeWrap = null;
  let overlay = null;

  function closeZoom() {
    if (activeWrap) {
      activeWrap.classList.remove("mermaid-zoomed");
      activeWrap = null;
    }
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    document.removeEventListener("keydown", onEscape);
  }

  function onEscape(e) {
    if (e.key === "Escape") closeZoom();
  }

  document.querySelectorAll(".mermaid-wrap").forEach((wrap) => {
    wrap.addEventListener("click", (e) => {
      e.stopPropagation();

      if (wrap.classList.contains("mermaid-zoomed")) {
        closeZoom();
        return;
      }

      closeZoom();

      overlay = document.createElement("div");
      overlay.className = "mermaid-zoom-overlay";
      overlay.addEventListener("click", closeZoom);
      document.body.appendChild(overlay);

      wrap.classList.add("mermaid-zoomed");
      activeWrap = wrap;
      wrap.scrollTop = 0;
      wrap.scrollLeft = 0;

      document.addEventListener("keydown", onEscape);
    });
  });
}
