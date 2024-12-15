async function loadMap() { // asynkron funktion som henter kortet
    try {
      const mapUrl = "https://api.mapbox.com/styles/v1/cbseksamen/cm3xaropx00gj01sd843w8j9a.html?title=copy&access_token=pk.eyJ1IjoiY2JzZWtzYW1lbiIsImEiOiJjbTN4OWZsNnYxN2Y2MmxxdGhpeGszdWQwIn0.jN9U6R_8wEWKKIgOjCtAbg&zoomwheel=true&fresh=true#10.37/55.6546/12.5665";
      const mapContainer = document.getElementById("map-container");
      const iframe = document.createElement("iframe"); // laver et iframe element som specifiseres
      iframe.width = "100%";
      iframe.height = "700px";
      iframe.src = mapUrl; // henter kortet fra mapbox til iframe
      iframe.style.border = "none";
      iframe.title = "Map";
      mapContainer.appendChild(iframe); // tilføjer kortet til map-container
    } catch (error) {
      console.error("Error loading the map:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", loadMap); // når DOM er loaded, kør loadMap funktionen