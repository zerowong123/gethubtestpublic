document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('getLocationButton');
    button.addEventListener('click', getLocation);
});

function getLocation() {
    const output = document.getElementById('output');
    const loader = document.getElementById('loader');

    // Show loader
    loader.style.display = "block";
    output.innerHTML = "";

    // Check if Geolocation API is available
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Hide loader
                loader.style.display = "none";

                // Success callback - show latitude and longitude
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                output.innerHTML = `<p>Latitude: ${latitude}</p><p>Longitude: ${longitude}</p>`;
                output.innerHTML += `<p><a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View on Google Maps</a></p>`;
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
            }
        );
    } else {
        loader.style.display = "none";
        output.textContent = "Geolocation is not supported by this browser.";
    }
}
