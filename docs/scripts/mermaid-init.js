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
    useMaxWidth: true,
    actorMargin: 50,
    messageMargin: 35,
    boxMargin: 10,
  },
  flowchart: {
    useMaxWidth: true,
  },
  themeVariables: {
    fontSize: "14px",
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
      document.addEventListener("keydown", onEscape);
    });
  });
}
