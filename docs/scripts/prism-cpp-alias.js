(function () {
  if (typeof window === "undefined" || !window.Prism) return;
  if (Prism.languages && Prism.languages.clike && !Prism.languages.cpp) {
    Prism.languages.cpp = Prism.languages.clike;
  }
  if (Prism.highlightAll) {
    Prism.highlightAll();
  }
})();
