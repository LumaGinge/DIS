async function loadMap() {
    try {
      const mapUrl = "https://api.mapbox.com/styles/v1/cbseksamen/cm3xaropx00gj01sd843w8j9a.html?title=false&access_token=pk.eyJ1IjoiY2JzZWtzYW1lbiIsImEiOiJjbTN4OWZsNnYxN2Y2MmxxdGhpeGszdWQwIn0.jN9U6R_8wEWKKIgOjCtAbg&zoomwheel=false#10.72/55.6576/12.5702";
      const mapContainer = document.getElementById("map-container");
      const iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "700px";
      iframe.src = mapUrl;
      iframe.style.border = "none";
      iframe.title = "Map";
      mapContainer.appendChild(iframe);
    } catch (error) {
      console.error("Error loading the map:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", loadMap);