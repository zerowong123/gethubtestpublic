document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('getLocationButton');
    button.addEventListener('click', getLocation);
});

let map;

function getLocation() {
    const output = document.getElementById('output');
    const loader = document.getElementById('loader');
    const mapDiv = document.getElementById('map');
    const apioutput = document.getElementById('apioutput');

    // Show loader
    loader.style.display = "block";
    output.innerHTML = "";
    apioutput.innerHTML = "";


    // Check if Geolocation API is available
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Hide loader
                loader.style.display = "none";

                // Success callback - show latitude and longitude
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                if (!map) {
                    map = L.map(mapDiv).setView([latitude, longitude], 13);
                    
                    // Load OpenStreetMap tiles
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                } else {
                    map.setView([latitude, longitude], 13);
                }

                // Add a marker to the map at the user's location
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup("You are here!")
                    .openPopup();
                output.innerHTML = `<p>Latitude: ${latitude}</p><p>Longitude: ${longitude}</p>`;

                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4b03bce954f532b687c0338bed594efb`)
                .then(response => response.json())
                .then(data => {

                    if (data && data.main) {
                        const temperature = data.main.temp;
                        const description = data.weather[0].description;
      
                    
                        apioutput.innerHTML=`<p>temperature:${Math.round(temperature-273.15)}°C</p>  <p>weather:${description}</p>`;


            }});

            },
            (error) => {
                // Hide loader and show error message
                loader.style.display = "none";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        output.textContent = "Permission denied. Please allow location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        output.textContent = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        output.textContent = "Request timed out. Please try again.";
                        break;
                    default:
                        output.textContent = "An unknown error occurred.";
                        break;
                }
            },
            {
                enableHighAccuracy: true
            }
        );
    } else {
        loader.style.display = "none";
        output.textContent = "Geolocation is not supported by this browser.";
    }
}
