function opencode(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".zoomable-image");

  images.forEach((image) => {
    image.addEventListener("click", function (e) {
      if (!image.classList.contains("zoomed")) {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.className = "zoom-overlay";
        overlay.onclick = function () {
          image.classList.remove("zoomed");
          document.body.removeChild(overlay);
        };
        document.body.appendChild(overlay);
        image.classList.add("zoomed");
        // Move image to top of DOM so it appears above overlay
        image.style.zIndex = 10001;
      } else {
        const overlay = document.querySelector(".zoom-overlay");
        if (overlay) document.body.removeChild(overlay);
        image.classList.remove("zoomed");
        image.style.zIndex = "";
      }
    });
  });
});
