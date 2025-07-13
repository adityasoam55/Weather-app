const API_KEY = "83688fade7434c76c4780c58d13fdb6d";
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const dropdownContainer = document.getElementById("dropdownContainer");
const recentDropdown = document.getElementById("recentDropdown");
const errorDiv = document.getElementById("error");
const currentWeatherDiv = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");
const forecastContainer = document.getElementById("forecastContainer");

// Fetch weather by city name
async function getWeatherByCity(city) {
  try {
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!currentResponse.ok) throw new Error("City not found");
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!forecastResponse.ok) throw new Error("Forecast not available");
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    errorDiv.classList.add("hidden");
  } catch (error) {
    showError(error.message);
  }
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
  try {
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!currentResponse.ok) throw new Error("Location not found");
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!forecastResponse.ok) throw new Error("Forecast not available");
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    errorDiv.classList.add("hidden");
  } catch (error) {
    showError(error.message);
  }
}

// Function to render the dropdown
function renderDropdown() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  recentDropdown.innerHTML = cities
    .map(
      (city) => `
      <div
        class="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
        onclick="selectRecentCity('${city}')"
      >
        ${city}
      </div>
    `
    )
    .join("");
}

//  Function to update recent cities in localStorage and UI
function updateRecentCities(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  // Avoid duplicates and limit to 5 items
  cities = cities.filter((c) => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city);
  if (cities.length > 5) cities.pop();

  localStorage.setItem("recentCities", JSON.stringify(cities));
  renderDropdown();
}

// function to handle city click from dropdown
function selectRecentCity(city) {
  cityInput.value = city;
  getWeatherByCity(city);
}

// Display current weather
function displayCurrentWeather(data) {
  dropdownContainer.classList.add("hidden"); //hide dropdown on api call

  document.getElementById(
    "cityName"
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById(
    "temperature"
  ).textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
  document.getElementById(
    "description"
  ).textContent = `Condition: ${data.weather[0].description}`;
  document.getElementById(
    "humidity"
  ).textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById(
    "currentIcon"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentWeatherDiv.classList.remove("hidden");
}

// Display 5-day forecast
function displayForecast(data) {
  forecastContainer.innerHTML = "";
  const dailyData = data.list.filter((reading) =>
    reading.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((day) => {
    const date = new Date(day.dt * 1000);
    const dayDiv = document.createElement("div");
    dayDiv.className = "text-center m-1 py-2 border border-indigo-400 rounded";
    dayDiv.innerHTML = `
      <p class="font-medium">${date.toLocaleDateString("en-US", {
        weekday: "short",
      })}</p>
      <img src="https://openweathermap.org/img/wn/${
        day.weather[0].icon
      }.png" alt="Weather Icon" class="mx-auto w-12 h-12">
      <p>${Math.round(day.main.temp)}°C</p>
      <p class="text-sm text-gray-600">${day.weather[0].description}</p>
    `;
    forecastContainer.appendChild(dayDiv);
  });

  forecastDiv.classList.remove("hidden");
}

// Show error message
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  currentWeatherDiv.classList.add("hidden");
  forecastDiv.classList.add("hidden");
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
    updateRecentCities(city);
    cityInput.value = "";
  } else {
    showError("Please enter a city name");
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => showError("Unable to access location")
    );
  } else {
    showError("Geolocation is not supported by your browser");
  }
});

// Allow Enter key to trigger search
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherByCity(city);
      updateRecentCities(city);
      cityInput.value = "";
    } else {
      showError("Please enter a city name");
    }
  }
  dropdownContainer.classList.add("hidden");
});

// Show dropdown when user focuses or types in the input
cityInput.addEventListener("input", () => {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (cities.length > 0) {
    dropdownContainer.classList.remove("hidden");
  }
});

// Also show dropdown when input is focused (even without typing)
cityInput.addEventListener("focus", () => {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (cities.length > 0) {
    dropdownContainer.classList.remove("hidden");
  }
});

// Hide dropdown when user clicks outside of the input or dropdown
document.addEventListener("click", (e) => {
  if (!cityInput.contains(e.target) && !dropdownContainer.contains(e.target)) {
    dropdownContainer.classList.add("hidden");
  }
});

renderDropdown();
