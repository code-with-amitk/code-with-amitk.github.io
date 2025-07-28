document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });

  sidebarOverlay.addEventListener("click", function () {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  // Close sidebar when a link is clicked (for single page navigation)
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  });

  // Image zoom functionality
  const zoomableImages = document.querySelectorAll(".zoomable-image");
  const zoomOverlay = document.createElement("div");
  zoomOverlay.className = "zoom-overlay";
  document.body.appendChild(zoomOverlay);

  zoomableImages.forEach((img) => {
    img.addEventListener("click", function () {
      if (this.classList.contains("zoomed")) {
        this.classList.remove("zoomed");
        zoomOverlay.style.display = "none";
      } else {
        this.classList.add("zoomed");
        zoomOverlay.style.display = "block";
      }
    });
  });

  zoomOverlay.addEventListener("click", function () {
    const zoomedImg = document.querySelector(".zoomable-image.zoomed");
    if (zoomedImg) {
      zoomedImg.classList.remove("zoomed");
      zoomOverlay.style.display = "none";
    }
  });

  // Handle window resize
  function handleResize() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  }

  window.addEventListener("resize", handleResize);
});
