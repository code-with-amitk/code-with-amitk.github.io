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
      const images = document.querySelectorAll('.zoomable-image');
  
      images.forEach(image => {
          image.addEventListener('click', () => {
              image.classList.toggle('zoomed');
          });
      });
  });
  