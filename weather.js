const API_KEY = "b301863aee3b4f69af0175539252212";
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") document.body.classList.add("dark");

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

async function fetchWeather(city) {
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        renderWeather(data);
    } catch {
            document.getElementById("weather").innerHTML = `<div class="error">City not found</div>`;
    }
}

function renderWeather(data) {
    const { location, current, forecast } = data;
    const aqi = current.air_quality["us-epa-index"];
    const aqiText = ["Good","Moderate","Unhealthy (Sensitive)","Unhealthy","Very Unhealthy","Hazardous"][aqi-1] || "Unknown";

    document.getElementById("weather").innerHTML = `
        <h3 style="text-align:center">${location.name}, ${location.country}</h3>
        <div class="time">${location.localtime}</div>

        <div class="temp">${current.temp_c}°C</div>

        <div class="condition">
          <img src="https:${current.condition.icon}">
          <span>${current.condition.text}</span>
        </div>

        <div class="details">
          <div class="detail">Feels Like<br><strong>${current.feelslike_c}°C</strong></div>
          <div class="detail">Humidity<br><strong>${current.humidity}%</strong></div>
          <div class="detail">Wind<br><strong>${current.wind_kph} km/h</strong></div>
          <div class="detail">Visibility<br><strong>${current.vis_km} km</strong></div>
        </div>

        <div class="aqi">Air Quality: ${aqiText} (EPA ${aqi})</div>

        <div class="forecast">
          <h4>3-Day Forecast</h4>
          <div class="forecast-grid">
            ${forecast.forecastday.map(day => `
              <div class="day">
                <div>${day.date}</div>
                <img src="https:${day.day.condition.icon}">
                <div>${day.day.condition.text}</div>
                <strong>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</strong>
              </div>
            `).join("")}
          </div>
        </div>
      `;
}

function searchCity() {
    const city = document.getElementById("cityInput").value.trim();
    if (city) fetchWeather(city);
}

fetchWeather("London");