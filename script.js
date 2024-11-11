// Function to get the local time of a city
async function getLocalTime(city) {
    const apiKey = '5b13bbd3f9fb5386cd3b047754632bb1'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            // Extract timestamp and timezone offset
            const timestamp = data.dt;  // UTC timestamp from the weather API
            const timezoneOffset = data.timezone;  // Timezone offset in seconds

            // Convert timestamp to UTC Date object
            const utcTime = new Date(timestamp * 1000); // Convert from seconds to milliseconds

            // Correctly apply the timezone offset (in milliseconds)
            const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);  // Apply the timezone offset in milliseconds

            // Convert the date into a more readable string (e.g., "Monday, November 11, 2024")
            const formattedDate = localTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            return { formattedDate, cityName: data.name, country: data.sys.country };
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to fetch weather data
async function weather() {
    const display = document.getElementById('display');
    const city = document.getElementById('search').value.trim();

    if (!city) {
        display.innerHTML = `<p class="text-warning fw-bold">Please enter a city name.</p>`;
        return;
    }

    display.innerHTML = `<p class="text-info fw-bold">Loading...</p>`;

    try {
        const cityData = await getLocalTime(city); // Fetch city local time
        if (!cityData) {
            display.innerHTML = `<p class="text-danger fw-bold">Could not fetch time for ${city}</p>`;
            return;
        }

        const { formattedDate, cityName, country } = cityData;

        // Fetch weather data
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5b13bbd3f9fb5386cd3b047754632bb1`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        const tempCelsius = (data.main.temp - 273.15).toFixed(2);
        const feelsLikeCelsius = (data.main.feels_like - 273.15).toFixed(2);
        const tempMinCelsius = (data.main.temp_min - 273.15).toFixed(2);
        const tempMaxCelsius = (data.main.temp_max - 273.15).toFixed(2);
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherMain = data.weather[0].main;

        let backgroundImage = 'https://t3.ftcdn.net/jpg/08/39/84/40/360_F_839844051_savJkwrT8vhPaMcAqu96fA80rn9yKnAr.jpg';
        let weatherIcon = 'https://cdn.dribbble.com/users/2120934/screenshots/6193524/19_mostlysunny.gif';

        // Weather conditions
        if (weatherMain === 'Clear') {
            backgroundImage = 'https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?cs=srgb&dl=pexels-asphotograpy-96622.jpg&fm=jpg';
            weatherIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Oxygen480-status-weather-clear.svg/800px-Oxygen480-status-weather-clear.svg.png';
        } else if (weatherMain === 'Clouds') {
            backgroundImage = 'https://support.janesweather.com/hc/article_attachments/4413920830991/mostly%252Bcloudy.jpeg';
            weatherIcon = 'https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png';
        } else if (weatherMain === 'Rain') {
            backgroundImage = 'https://i.pinimg.com/736x/71/a7/9b/71a79b564478b7ac1ce7ffdac6d14301.jpg';
            weatherIcon = 'https://i.pinimg.com/originals/77/90/79/77907906cb11350dc7348fe4293ebe82.png';
        } else if (weatherMain === 'Snow') {
            backgroundImage = 'https://example.com/snowy-background.jpg';
            weatherIcon = 'https://w7.pngwing.com/pngs/561/405/png-transparent-weather-forecasting-symbol-blue-snow-weather-symbol-blue-cloud-symmetry.png';
        } else if (weatherMain === 'Thunderstorm') {
            backgroundImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/FoggDam-NT.jpg/640px-FoggDam-NT.jpg';
            weatherIcon = 'https://i.pinimg.com/564x/87/89/92/878992db9d41b6f15291b9c1e59474ca.jpg';
        } else if (weatherMain === 'Haze') {
            backgroundImage = 'https://media.istockphoto.com/id/1055906130/photo/foggy-rural-asphalt-highway-perspective-with-white-line-misty-road-road-with-traffic-and.jpg?s=612x612&w=0&k=20&c=NS_1x0gGJQkJ7RfC1J17bzu5PFj2xJGYoLA6L3BCZzg=';
            weatherIcon = 'https://cdn-icons-png.flaticon.com/512/1779/1779807.png';
        }

        // HTML layout
        display.innerHTML = `
            <div id="weatherContainer" class="container-fluid text-dark border rounded p-4" style="background-size: cover; background-position: center; height: auto; max-height: 100%; max-width: 800px; background-image:url('${backgroundImage}'); overflow: hidden;">
                <div class="text-center mb-3">
                    <h4 class="fw-bold">${formattedDate}</h4>
                </div>
                <div class="row d-flex justify-content-between align-items-center">
                    <div class="col-md-6 text-md-start text-center mb-3 mb-md-0">
                        <h1 class="fw-bold">${tempCelsius} °C <span style="font-size: 20px;" class="fw-bold">${weatherMain}</span>
                            <img src="${weatherIcon}" class="ms-2" alt="Weather Icon" style="height: 60px; width: 60px;">
                        </h1>
                        <h5 class="fw-bold">Temp Min: ${tempMinCelsius}°C</h5>
                        <h5 class="fw-bold">Temp Max: ${tempMaxCelsius}°C</h5>
                    </div>
                    <div class="col-md-6 text-md-end text-center">
                        <p id="humidity" class="mb-2 fw-bold">Humidity: ${humidity}%</p>
                        <p id="pressure" class="mb-2 fw-bold">Pressure: ${pressure} hPa</p>
                        <p id="wind" class="mb-2 fw-bold">Wind Speed: ${windSpeed} m/s</p>
                    </div>
                </div>
                <h3 id="cityName" class="mb-3 fw-bold text-center">${cityName}</h3>
                <h4 class="fw-bold text-center">${country}</h4>
                <h5 class="fw-bold text-center mb-3">Feels Like: ${feelsLikeCelsius}°C</h5>
                <div class="text-center">
                    <button onclick="location.reload()" class="btn btn-dark mt-3 mb-3">Refresh</button>
                </div>
            </div>`;
    } catch (error) {
        display.innerHTML = `<p class="text-danger fw-bold">Error: ${error.message}</p>`;
    }
};
